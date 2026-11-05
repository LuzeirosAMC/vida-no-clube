# Arquitetura e manutenção

## Visão geral

A aplicação é renderizada pelo Vinext e executada em um Cloudflare Worker. Páginas de conteúdo público e páginas administrativas usam o mesmo projeto. O D1 guarda dados estruturados; o R2 será usado apenas para arquivos enviados.

```text
Navegador
   ├── páginas públicas
   ├── /minha-conta (usuário autenticado)
   └── /portal (diretor, mídia ou tesoureiro)
           │
           ▼
     rotas em app/api
           │
      ┌────┴────┐
      ▼         ▼
   D1 (DB)   R2 (BUCKET, futuro)
```

## Autenticação

`lib/site-auth.ts` concentra hashes de senha, criação e remoção de sessão, leitura do usuário atual e verificações de cargo.

1. O cadastro normaliza o login e cria sempre um `guest`;
2. A senha é transformada em PBKDF2-SHA256;
3. O navegador recebe um token aleatório em cookie HttpOnly;
4. Apenas o SHA-256 desse token é salvo em `sessions`;
5. `getSiteUser()` aceita somente sessão não expirada e usuário ativo.

Uma mudança de domínio invalida os cookies existentes, mas não apaga contas.

## Conteúdo e moderação

`submissions` armazena relatos e fotos. O fluxo é:

```text
envio → pending → approved ou rejected
```

- `/api/submissions` cria o conteúdo;
- `/portal` lista a fila para diretor e mídia;
- `/api/admin/submissions/:id` registra a decisão e auditoria;
- páginas públicas consultam apenas `approved`;
- `/api/media/:id` só entrega um objeto R2 aprovado.

Os arquivos em `public/media/` são parte editorial do próprio site e nunca entram na fila de aprovação.

## Doações

`bank_details` possui uma única linha (`id = 1`). `enabled` controla a publicação sem apagar as informações. `donation_reports` registra declarações feitas no botão “Já doei”; a tesouraria deve confirmar ou marcar como não localizada.

## Cargos

As funções `canAccessDashboard`, `canModerate` e `canManageDonations` são a fonte de verdade para permissões. A interface pode esconder botões, mas toda rota administrativa também valida o cargo no servidor.

## Alterações no banco

Não edite uma migração já aplicada para modificar produção. Para mudanças futuras:

1. Atualize `db/schema.ts`;
2. Gere uma nova migração;
3. Revise o SQL;
4. Faça backup ou exportação quando a mudança for sensível;
5. Aplique primeiro em ambiente de teste;
6. Aplique no D1 remoto e publique o Worker.

O ajuste do valor padrão para `guest` na migração inicial serve apenas a bancos criados do zero; cadastros atuais já definem o cargo explicitamente.

## Pontos para evolução

- Ativar e vincular o R2 conforme `docs/R2.md`;
- Adicionar proteção antiabuso/rate limiting a login, cadastro, relatos e “Já doei” antes de campanhas públicas de grande alcance;
- Implementar paginação em `/relatos` caso o volume cresça muito;
- Criar rotina de limpeza de sessões expiradas;
- Avaliar domínio próprio para uma URL institucional permanente;
- Adicionar testes automatizados de permissões e rotas críticas.
