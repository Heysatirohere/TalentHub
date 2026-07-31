# 🎓 NPA — Núcleo de Protagonismo Alvarista (FECAP)

O **NPA (Núcleo de Protagonismo Alvarista)** é uma plataforma web institucional de alta performance desenvolvida para a **FECAP (Fundação Escola de Comércio Álvares Penteado)**. O sistema conecta estudantes ao mercado de trabalho através de avaliação de competências comportamentais, histórico acadêmico validado, algoritmo de match inteligente e prospecção ativa para empresas parceiras.

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
* **Next.js 16 (App Router & Turbopack)**: Renderização híbrida (SSG/SSR/CSR) e navegação otimizada.
* **React 19 & TypeScript**: Tipagem estrita e arquitetura baseada em componentes reutilizáveis.
* **Estilização**: Vanilla CSS com variáveis de design tokens institucionais (`globals.css`) e TailwindCSS para layouts responsivos.
* **Suporte a Dark / Light Mode**: Alternância dinâmica de tema com persistência local e contraste auditado.
* **Lucide React**: Biblioteca de ícones vetoriais modernos.

### **Back-end & Banco de Dados**
* **Prisma ORM (v7)**: Modelagem relacional e queries tipadas.
* **PostgreSQL (Supabase)**: Persistência de dados em produção para Usuários, Alunos, Empresas, Vagas, Mensagens e Candidaturas.
* **Supabase Realtime**: Infraestrutura de mensagens instantâneas e sincronização.
* **bcryptjs**: Criptografia de senhas com salt rounds configurados.

### **Cibersegurança & Infraestrutura**
* **Next.js Middleware (RBAC Estrito)**: Interceptação global de rotas por perfis de acesso (`ALUNO`, `EMPRESA`, `MASTER`).
* **Security Headers OWASP**:
  * `X-Frame-Options: DENY` (Proteção contra Clickjacking).
  * `X-Content-Type-Options: nosniff` (Previne MIME Sniffing).
  * `Strict-Transport-Security (HSTS)`: Comunicação forçada via HTTPS por 2 anos.
  * `Referrer-Policy` e `Permissions-Policy`.
* **Guard Server-Side (`requireAuth`)**: Validação de sessão e perfil no topo de todas as Server Actions e rotas API, impedindo bypasses no cliente.

---

## 🚀 Funcionalidades Principais por Perfil

### 1. 🎓 **Hub do Aluno (`/aluno`)**
* **Painel do Estudante**: Visualização do RA, curso, histórico acadêmico e progresso geral.
* **Trilhas de Soft Skills**: Realização de testes comportamentais (Comunicação, Liderança, Trabalho em Equipe, Adaptabilidade, Resolução de Problemas e Pensamento Crítico).
* **Painel de Vagas & Match**: Algoritmo de cruzamento em tempo real exibindo a porcentagem de Match do aluno para cada vaga.
* **Minhas Candidaturas**: Candidatura em 1 clique e gestão simplificada de vagas aplicadas.
* **Envio de Documentos**: Submissão de comprovantes e documentos simulados para análise da coordenação.

### 2. 🏢 **Hub Empresas (`/empresa`)**
* **Cadastro de Campanhas / Vagas**: Publicação de vagas com pesos técnicos (0 a 5 por disciplina) e soft skills exigidas.
* **Busca Ativa de Talentos (`/empresa/banco-talentos`)**: Filtros em tempo real por Palavra-Chave, RA, Curso, Média Acadêmica Mínima (CR) e Soft Skills obrigatórias.
* **Ranking por Match (`/empresa/filtragem`)**: Ranqueamento automatizado de candidatos ordenados por compatibilidade técnica e comportamental.
* **Perfil Expandido do Aluno**: Boletim escolar verificado pela FECAP, histórico de experiências e feedbacks dos docentes.
* **Chat Integrado**: Comunicação em tempo real via chat entre recrutadores e candidatos.

### 3. 🛡️ **Hub Master / Coordenação (`/master`)**
* **Painel de Governança**: Métricas institucionais de empregabilidade e distribuição de competências.
* **Validação de Mentorias**: Aprovação presencial e validação final de soft skills aprovadas nos testes.
* **Gestão Global**: Supervisão de vagas ativas e banco de alunos.

---

## 🔒 Arquitetura de Cibersegurança

| Camada | Mecanismo | Função |
| :--- | :--- | :--- |
| **Borda / Navegação** | `middleware.ts` | Bloqueia usuários não autenticados e redireciona tentativas cross-role para `/acesso-negado`. |
| **Cabeçalhos HTTP** | `next.config.ts` | Injeta diretivas OWASP no Next.js (Frameguard, HSTS, Sniff-guard). |
| **Server-Side Actions** | `lib/authGuard.ts` | Valida o cookie `auth_session` em todas as rotas `/api/*` e Server Actions no servidor. |
| **Camada de Banco** | Prisma ORM & PostgreSQL | Parametrização automática contra SQL Injection e integridade relacional. |

---

## 📦 Como Rodar o Projeto Localmente

### **Pré-requisitos**
* Node.js v18+ 
* NPM ou Yarn
* Instância do PostgreSQL ou projeto Supabase configurado

### **Passos**

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/Heysatirohere/TalentHub.git
   cd TalentHub/meu-projeto
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Configurar as variáveis de ambiente (`.env`):**
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
   DIRECT_URL="postgresql://usuario:senha@host:5432/banco"
   NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anonima"
   ```

4. **Sincronizar o Banco de Dados (Prisma):**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

6. **Gerar Build de Produção:**
   ```bash
   npm run build
   ```

---

## 📄 Licença
Este projeto foi desenvolvido para fins institucionais e educacionais da **FECAP (Fundação Escola de Comércio Álvares Penteado)**. Todos os direitos reservados.
