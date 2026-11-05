# Vida no Clube — Luzeiros

Site oficial e portal de membros do Clube de Desbravadores Luzeiros, de Bandeirantes, Contagem/MG.

- Produção: [vida-no-clube.luzeiros.workers.dev](https://vida-no-clube.luzeiros.workers.dev)
- Instagram: [@luzeiros.amc](https://www.instagram.com/luzeiros.amc/)
- Repositório do clube: [LuzeirosAMC/vida-no-clube](https://github.com/LuzeirosAMC/vida-no-clube)

## Estado atual

O site público, autenticação, moderação de relatos, cargos, dados bancários e registro de doações estão publicados na conta Cloudflare do clube. O D1 está ativo e é o banco de produção.

O **Cloudflare R2 ainda não está ativado**. Por isso, relatos em texto funcionam normalmente, mas o envio de novas fotos permanece desabilitado. As imagens iniciais em `public/media/` são arquivos estáticos e não dependem do R2.

## Funcionalidades

### Área pública

- História, atividades e informações do clube;
- Galeria inicial baseada no Instagram oficial;
- Três relatos aprovados mais recentes na página inicial;
- Página `/relatos` com todos os relatos aprovados;
- Área de doações com Pix controlado pelo diretor ou tesoureiro;
- Formulário “Já doei” para posterior conferência da tesouraria;
- Contato oficial por Instagram e WhatsApp;
- Layout responsivo e animações de rolagem.

### Contas e cargos

Todo cadastro novo recebe o cargo **Convidado**, independentemente do nome, idade ou senha. O cadastro usa login, senha e data de nascimento.

| Cargo | Permissões |
| --- | --- |
| Diretor | Acesso completo, cargos, moderação, doações e dados bancários |
| Tesoureiro | Dados bancários e conferência das doações informadas |
| Mídia | Aprovação ou rejeição de relatos e, futuramente, fotos |
| Membro | Envio de conteúdo para aprovação, sem painel administrativo |
| Convidado | Envio de conteúdo para aprovação, sem painel administrativo |

Visitantes sem conta podem navegar pelo site e informar doações. A data de nascimento nunca é exibida publicamente. Diretor e mídia veem apenas o marcador **Criança** quando a pessoa tem menos de 18 anos.

## Regras importantes de negócio

- Todo relato novo começa como `pending`;
- Apenas diretor ou mídia podem aprovar ou rejeitar conteúdo;
- Somente conteúdo `approved` aparece publicamente;
- A página inicial exibe no máximo três relatos; `/relatos` exibe todos;
- Um registro em “Já doei” não é comprovante: diretor ou tesoureiro ainda precisa conferi-lo;
- Dados bancários só aparecem quando há chave Pix, titular e a opção de exibição pública está ativada;
- Desativar a exibição pública oculta os dados sem apagá-los;
- Apenas o diretor altera cargos;
- Todo cadastro público nasce como `guest` (Convidado).

## Tecnologias

- React 19, TypeScript, Vinext e Vite;
- Cloudflare Workers;
- Cloudflare D1 e Drizzle ORM;
- Cloudflare R2 preparado, porém ainda não vinculado;
- Lucide Icons e CSS responsivo próprio.

## Desenvolvimento

Requisitos: Node.js `22.13.0` ou superior e Git.

```bash
npm run install:ci
npm run dev
```

O servidor local usa `http://127.0.0.1:5173`. O D1 local é separado do banco publicado e precisa da migração inicial:

```bash
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_luzeiros_core.sql
```

## Verificação e publicação

```bash
npm run build
npm run lint
npm run deploy:cloudflare
```

A configuração de produção está em `wrangler.production.jsonc`. O Worker se chama `vida-no-clube`, usa o binding D1 `DB` e publica em `vida-no-clube.luzeiros.workers.dev`.

Antes de publicar:

1. Confirme que o build termina sem erros;
2. Revise as migrações quando o esquema for alterado;
3. Não inclua senhas, tokens ou dados bancários no Git;
4. Teste cadastro, login, envio, moderação e doações;
5. Verifique computador e celular;
6. Faça commit e envie para `origin` e `upstream`.

## Cloudflare R2

O código já aceita um binding opcional chamado `BUCKET`. Enquanto ele não existe:

- o formulário envia apenas relatos em texto;
- tentativas de foto recebem uma mensagem de indisponibilidade;
- a rota de mídia retorna indisponibilidade sem expor arquivos;
- as demais funções continuam operando normalmente.

O procedimento completo para ativação está em [`docs/R2.md`](docs/R2.md). Depois da ativação, fotos continuam privadas e só são servidas por `/api/media/:id` após aprovação.

## Estrutura

- `app/`: páginas e rotas HTTP;
- `app/api/`: autenticação, conteúdo, moderação, doações e mídia;
- `app/portal/`: painel de diretor, mídia e tesoureiro;
- `app/minha-conta/`: envio de relatos por usuários autenticados;
- `db/`: esquema Drizzle e acesso ao D1;
- `drizzle/`: migrações versionadas;
- `lib/site-auth.ts`: senha, sessão, cargos e permissões;
- `public/media/`: imagens públicas que fazem parte do site;
- `docs/ARQUITETURA.md`: fluxo técnico e pontos de manutenção;
- `docs/R2.md`: ativação do armazenamento de fotos;
- `wrangler.production.jsonc`: bindings e publicação do Worker.

## Segurança e privacidade

- Senhas usam PBKDF2-SHA256 com salt individual;
- Sessões armazenam somente o hash do token no D1;
- Cookies são `HttpOnly`, `SameSite=Lax` e `Secure` em produção;
- Contas desativadas não mantêm acesso;
- Conteúdo público exige aprovação humana;
- Ações administrativas importantes geram auditoria;
- Fotos futuras ficam privadas no R2 e são entregues por uma rota controlada;
- JPG, PNG e WebP terão limite de 8 MB;
- Dados bancários são administrados apenas por diretor ou tesoureiro.

## Documentação adicional

- [Arquitetura e manutenção](docs/ARQUITETURA.md)
- [Ativação do R2](docs/R2.md)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Drizzle ORM com D1](https://orm.drizzle.team/docs/get-started/d1-new)
