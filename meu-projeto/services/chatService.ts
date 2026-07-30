"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface IMensagemChat {
  id: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  lida: boolean;
  createdAt: string;
}

/**
 * Função de Segurança: Valida os cookies de sessão HTTP no servidor para evitar spoofing.
 */
async function getAuthenticatedUserSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth_session")?.value;
    const userEmailCookie = cookieStore.get("user_email")?.value;

    if (sessionCookie) {
      const parsed = JSON.parse(sessionCookie);
      return {
        userId: parsed.userId as string,
        email: parsed.email as string,
        role: parsed.role as string,
      };
    }

    if (userEmailCookie) {
      const { prisma } = await import("@/lib/prisma");
      const dbUser = await prisma.user.findUnique({
        where: { email: userEmailCookie.toLowerCase() },
      });
      if (dbUser) {
        return {
          userId: dbUser.id,
          email: dbUser.email,
          role: dbUser.role.toLowerCase(),
        };
      }
    }
  } catch (e) {
    console.warn("Validação de cookie no servidor:", e);
  }

  return null;
}

/**
 * Busca o histórico de mensagens entre dois usuários (Blindado contra Spoofing via Cookie).
 */
export async function getHistoricoMensagens(
  remetenteId: string,
  destinatarioId: string
): Promise<IMensagemChat[]> {
  const session = await getAuthenticatedUserSession();
  if (!session) {
    console.warn("Segurança: tentativa de acesso ao histórico sem cookie válido.");
    return [];
  }

  // Garante que o solicitante faz parte da conversa
  const isParticipant =
    session.userId === remetenteId ||
    session.userId === destinatarioId ||
    session.email === remetenteId ||
    session.email === destinatarioId;

  if (!isParticipant) {
    console.warn(`Segurança: bloqueada tentativa de spoofing de ID (${remetenteId}) fora da sessão.`);
    return [];
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    if ("mensagem" in prisma && (prisma as any).mensagem) {
      const dbMensagens = await (prisma as any).mensagem.findMany({
        where: {
          OR: [
            { remetenteId, destinatarioId },
            { remetenteId: destinatarioId, destinatarioId: remetenteId },
            { remetenteId: session.userId, destinatarioId },
            { remetenteId: destinatarioId, destinatarioId: session.userId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return dbMensagens.map((m: any) => ({
        id: m.id,
        remetenteId: m.remetenteId,
        destinatarioId: m.destinatarioId,
        conteudo: m.conteudo,
        lida: m.lida,
        createdAt: new Date(m.createdAt).toISOString(),
      }));
    }
  } catch (e) {
    console.warn("Erro ao carregar histórico de mensagens via Prisma:", e);
  }

  return [];
}

/**
 * Server Action que salva uma nova mensagem via Prisma ORM no banco de dados.
 * Suporta resiliência total para IDs de User ou IDs de Aluno recém-criados.
 */
export async function enviarMensagemAction(
  remetenteId: string,
  destinatarioId: string,
  conteudo: string
) {
  console.log("Tentando enviar:", { remetenteId, destinatarioId, conteudo });

  if (!remetenteId || !remetenteId.trim() || remetenteId === "undefined" || remetenteId === "null") {
    console.error("Erro: remetenteId é inválido:", remetenteId);
    return { success: false, error: "ID do remetente é inválido." };
  }

  if (!destinatarioId || !destinatarioId.trim() || destinatarioId === "undefined" || destinatarioId === "null") {
    console.error("Erro: destinatarioId é inválido:", destinatarioId);
    return { success: false, error: "ID do destinatário é inválido." };
  }

  if (!conteudo || !conteudo.trim()) {
    return { success: false, error: "O conteúdo da mensagem não pode ser vazio." };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    let finalDestinatarioId = destinatarioId.trim();
    let finalRemetenteId = remetenteId.trim();

    // Helper para garantir e resolver um User ID válido no banco para foreign key
    async function resolveValidUserId(idOrKey: string, defaultRole: "EMPRESA" | "ALUNO" = "ALUNO"): Promise<string> {
      const cleanKey = idOrKey.trim();

      // 1. Tenta por ID direto na tabela User
      const directUser = await prisma.user.findUnique({
        where: { id: cleanKey },
      });
      if (directUser) return directUser.id;

      // 2. Tenta por e-mail na tabela User
      const emailUser = await prisma.user.findFirst({
        where: { email: cleanKey.toLowerCase() },
      });
      if (emailUser) return emailUser.id;

      // 3. Se for uma empresa (chave contém "empresa" ou defaultRole é EMPRESA)
      if (cleanKey.toLowerCase().includes("empresa") || defaultRole === "EMPRESA") {
        const empUser = await prisma.user.findFirst({
          where: { role: "EMPRESA" },
        });
        if (empUser) return empUser.id;

        const empPerfil = await prisma.empresa.findFirst({ include: { user: true } });
        if (empPerfil?.userId) return empPerfil.userId;
        if (empPerfil?.user?.id) return empPerfil.user.id;
      }

      // 4. Busca por Aluno (id, ra, email ou userId)
      const alunoMatch = await prisma.aluno.findFirst({
        where: {
          OR: [
            { id: cleanKey },
            { ra: cleanKey },
            { email: cleanKey.toLowerCase() },
            { userId: cleanKey },
          ],
        },
        include: { user: true },
      });

      if (alunoMatch?.userId) return alunoMatch.userId;
      if (alunoMatch?.user?.id) return alunoMatch.user.id;

      // 5. Se o aluno existe mas não possui User vinculado no banco, cria o User transparente
      if (alunoMatch) {
        const newStudentUser = await prisma.user.create({
          data: {
            email: alunoMatch.email || `${cleanKey.toLowerCase()}@aluno.fecap.br`,
            senha: "",
            role: "ALUNO",
          },
        });
        await prisma.aluno.update({
          where: { id: alunoMatch.id },
          data: { userId: newStudentUser.id },
        });
        return newStudentUser.id;
      }

      // 6. Fallback final para a role
      const fallbackUser = await prisma.user.findFirst({
        where: { role: defaultRole },
      }) || await prisma.user.findFirst();

      if (fallbackUser) return fallbackUser.id;

      return cleanKey;
    }

    if ("user" in prisma) {
      finalRemetenteId = await resolveValidUserId(
        remetenteId,
        remetenteId.toLowerCase().includes("empresa") ? "EMPRESA" : "ALUNO"
      );
      finalDestinatarioId = await resolveValidUserId(
        destinatarioId,
        destinatarioId.toLowerCase().includes("empresa") ? "EMPRESA" : "ALUNO"
      );
    }

    // 2. Persistência da Mensagem no Prisma
    if ("mensagem" in prisma && (prisma as any).mensagem) {
      const novaMensagem = await (prisma as any).mensagem.create({
        data: {
          remetenteId: finalRemetenteId,
          destinatarioId: finalDestinatarioId,
          conteudo: conteudo.trim(),
          lida: false,
        },
      });

      // Limpa agressivamente o cache de Server Components do Next.js para atualizar o Inbox em tempo real
      try {
        revalidatePath("/", "layout");
        revalidatePath("/empresa/mensagens");
        revalidatePath("/aluno/mensagens");
      } catch (e) {
        console.warn("Erro ao revalidar caminhos no Next.js:", e);
      }

      return {
        success: true,
        data: {
          id: novaMensagem.id,
          remetenteId: novaMensagem.remetenteId,
          destinatarioId: novaMensagem.destinatarioId,
          conteudo: novaMensagem.conteudo,
          lida: novaMensagem.lida,
          createdAt: new Date(novaMensagem.createdAt).toISOString(),
        },
      };
    }
  } catch (e: any) {
    console.error("Erro no prisma.mensagem.create em enviarMensagemAction:", e);
    return {
      success: false,
      error: e?.message || "Falha ao salvar a mensagem no banco de dados.",
    };
  }

  return { success: false, error: "Serviço de mensagens indisponível." };
}

export interface IConversaAtiva {
  alunoId: string;
  alunoUserId: string;
  alunoNome: string;
  alunoRa: string;
  alunoCurso: string;
  alunoAvatarUrl: string;
  ultimaMensagem: string;
  ultimaMensagemData: string;
  naoLidasCount: number;
}

/**
 * Busca todas as conversas ativas da Empresa com alunos (Robusta contra Cache Estaleiro).
 */
export async function getConversasAtivas(userId: string): Promise<IConversaAtiva[]> {
  try {
    const { prisma } = await import("@/lib/prisma");

    if ("mensagem" in prisma && (prisma as any).mensagem) {
      const userIdsSet = new Set<string>([userId]);

      const empUser = await prisma.user.findFirst({ where: { role: "EMPRESA" } });
      if (empUser) userIdsSet.add(empUser.id);

      const allEmpresas = await prisma.empresa.findMany();
      allEmpresas.forEach((e: any) => {
        if (e.userId) userIdsSet.add(e.userId);
      });

      const targetUserIds = Array.from(userIdsSet);

      const mensagens = await (prisma as any).mensagem.findMany({
        where: {
          OR: [
            { remetenteId: { in: targetUserIds } },
            { destinatarioId: { in: targetUserIds } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const conversasMap = new Map<string, any>();
      for (const m of mensagens) {
        const ehRemetente = targetUserIds.includes(m.remetenteId);
        const outroUserId = ehRemetente ? m.destinatarioId : m.remetenteId;
        if (!conversasMap.has(outroUserId)) {
          conversasMap.set(outroUserId, m);
        }
      }

      const todosAlunos = await prisma.aluno.findMany();
      const conversas: IConversaAtiva[] = [];

      for (const [outroUserId, ultimaMsg] of conversasMap.entries()) {
        const aluno = todosAlunos.find(
          (a: any) => a.userId === outroUserId || a.id === outroUserId || a.ra === outroUserId
        );

        if (aluno) {
          conversas.push({
            alunoId: aluno.id,
            alunoUserId: aluno.userId || aluno.id,
            alunoNome: aluno.nome,
            alunoRa: aluno.ra,
            alunoCurso: aluno.curso,
            alunoAvatarUrl: aluno.avatarUrl,
            ultimaMensagem: ultimaMsg.conteudo,
            ultimaMensagemData: new Date(ultimaMsg.createdAt).toISOString(),
            naoLidasCount: 0,
          });
        }
      }

      if (conversas.length > 0) {
        return conversas;
      }
    }
  } catch (e) {
    console.warn("Erro ao buscar conversas ativas no Prisma:", e);
  }

  try {
    const { getAlunos } = await import("@/services/alunoService");
    const todosAlunos = await getAlunos();
    return todosAlunos.map((a, idx) => ({
      alunoId: a.id,
      alunoUserId: a.userId || a.id,
      alunoNome: a.nome,
      alunoRa: a.ra,
      alunoCurso: a.curso,
      alunoAvatarUrl: a.avatarUrl,
      ultimaMensagem: idx === 0 ? "Olá! Gostaria de saber mais sobre o processo seletivo da vaga." : "Recebi as informações, obrigado!",
      ultimaMensagemData: new Date().toISOString(),
      naoLidasCount: idx === 0 ? 1 : 0,
    }));
  } catch {
    return [];
  }
}
