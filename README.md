# Clube de Desbravadores Luzeiros

Site oficial e portal de membros do Clube de Desbravadores Luzeiros, de Bandeirantes, Contagem/MG.

O projeto reúne a história do clube, atividades, memórias, doações e uma área privada para envio e moderação de fotos e relatos.

## Funcionalidades

### Site público

- História e informações oficiais do clube;
- Galeria inicial baseada no Instagram `@luzeiros.amc`;
- Memórias enviadas por membros e aprovadas pela equipe;
- Área de doações com dados bancários administráveis;
- Formulário “Já doei”, com quantia e finalidade da contribuição;
- Layout responsivo para computadores e dispositivos móveis.

### Contas e permissões

O cadastro utiliza login, senha e data de nascimento. As senhas são armazenadas somente como hashes PBKDF2.

Existem quatro cargos:

- **Diretor:** acesso completo ao painel, cargos, moderação, doações e dados bancários;
- **Tesoureiro:** edita os dados bancários e confere as doações informadas;
- **Mídia:** aprova ou rejeita fotos, comentários e relatos;
- **Membro:** envia conteúdos para aprovação, sem acesso ao painel administrativo.

Visitantes não precisam de conta para visualizar o site ou informar uma doação.

A data de nascimento não é exibida publicamente. Quando um usuário tem menos de 18 anos, somente diretor e mídia visualizam o marcador **Criança**.

> A primeira conta cadastrada em um banco de dados novo recebe o cargo de diretor. As contas seguintes são criadas como membros.

## Tecnologias

- React 19;
- Vinext e Vite;
- TypeScript;
- Cloudflare Workers;
- Cloudflare D1 para dados estruturados;
- Cloudflare R2 para fotos enviadas;
- Drizzle ORM;
- Lucide Icons.

## Requisitos

- Node.js `22.13.0` ou superior;
- Git;
- Dependências instaladas a partir do `package-lock.json`.

## Instalação

Na pasta do projeto, execute:

```bash
npm run install:ci
```

## Desenvolvimento local

```bash
npm run dev
```

O endereço padrão é `http://127.0.0.1:5173`.

## Banco de dados local

O esquema está em [`db/schema.ts`](db/schema.ts) e a migração inicial está em [`drizzle/0000_luzeiros_core.sql`](drizzle/0000_luzeiros_core.sql).

Depois de gerar uma compilação, aplique a migração no D1 local:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_luzeiros_core.sql
```

O banco local e o banco publicado são ambientes separados.

## Compilação

```bash
npm run build
```

## Estrutura principal

- `app/`: páginas, formulários e rotas da aplicação;
- `app/portal/`: painel administrativo;
- `app/minha-conta/`: área de envio dos membros;
- `app/doacoes/`: página pública de doações;
- `app/api/`: autenticação, moderação, doações e arquivos;
- `db/`: esquema e acesso ao banco D1;
- `drizzle/`: migrações do banco;
- `public/media/`: imagens públicas iniciais;
- `worker/`: entrada do Cloudflare Worker.

## Segurança e privacidade

- Sessões utilizam cookies `HttpOnly` e `SameSite=Lax`;
- Senhas não são armazenadas em texto puro;
- Fotos enviadas ficam privadas no R2 até serem aprovadas;
- Somente arquivos JPG, PNG ou WebP de até 8 MB são aceitos;
- Conteúdos só aparecem publicamente após aprovação;
- Alterações administrativas relevantes são registradas no histórico de auditoria;
- Dados bancários só podem ser alterados por diretor ou tesoureiro.

## Repositórios

- Desenvolvimento: [zazfz196/vida-no-clube](https://github.com/zazfz196/vida-no-clube)
- Repositório do clube: [LuzeirosAMC/vida-no-clube](https://github.com/LuzeirosAMC/vida-no-clube)

## Referências

- [Instagram oficial do Luzeiros](https://www.instagram.com/luzeiros.amc/)
- [Página oficial do clube](https://clubes.adventistas.org/br/amc/5096/luzeiros/)
- [Vinext](https://github.com/cloudflare/vinext)
- [Drizzle ORM com D1](https://orm.drizzle.team/docs/get-started/d1-new)
