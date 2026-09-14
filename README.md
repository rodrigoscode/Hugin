# Hugin

> *Antes que o sol toque Midgard, Odin solta seus dois corvos ao vento: **Hugin**, o Pensamento, e **Munin**, a Memória. Eles cruzam os nove reinos, rasgam tempestades e sobrevoam campos de batalha onde nenhum mortal ousa pisar. Quando a noite cai, retornam ao ombro do Pai de Todos e sussurram tudo o que seus olhos viram.*
>
> *Hoje, Hugin não voa só para Odin. Ele parte da sua tela, atravessa os céus sem pousar em servidor algum e entrega cada quadro, ao vivo, aos olhos de quem luta ao seu lado na call.*

Transmita sua tela ao vivo para os amigos que estão no mesmo servidor do Discord, em alta qualidade, com o vídeo indo direto do seu PC para o deles.

## O que ele faz

- **Compartilhamento de tela dentro do Discord.** O botão de compartilhar tela da call passa a abrir o Hugin, com a mesma aparência do Discord: escolha um aplicativo ou a tela inteira e pronto.
- **Direto entre os PCs.** O vídeo vai de um computador para o outro (P2P, via [VDO.Ninja](https://vdo.ninja)), sem passar pelos servidores do Discord.
- **Qualidade de verdade.** 720p, 1080p, 1440p ou a resolução original da tela, a 15, 30 ou 60 fps. Dá para trocar a qualidade no meio da transmissão sem derrubar ninguém.
- **Áudio sem eco.** Transmitindo uma janela, só o som daquele aplicativo vai junto. Transmitindo a tela inteira, vai todo o som do PC menos o do Discord: as vozes da call, os sons de entrar, sair e mutar e as transmissões que você está assistindo ficam de fora. Dá para ligar e desligar o áudio no ar.
- **Ao Vivo no servidor todo.** O selo "Ao Vivo" aparece em quem está transmitindo em qualquer call do servidor. Passe o mouse para ver a prévia e clique para entrar na call e assistir.
- **Assistir como no Discord.** Prévia junto dos cards de atividade, palco com tela cheia, zoom com minimapa, janela flutuante (PiP) quando você sai da tela da call e volume até 200%.
- **Sem configuração.** Quem entra no mesmo canal de voz com o Hugin cai automaticamente na mesma sala, protegida por senha derivada do canal.

## Como usar

1. Baixe o `Hugin.exe` na [última release](https://github.com/leandromlc/Hugin/releases/latest).
2. Dê dois cliques. Ele fecha o Discord, instala e abre o Discord de novo.
3. Entre numa call de voz e clique no botão de compartilhar tela.
4. Seus amigos precisam ter o Hugin instalado também. Eles veem o "Ao Vivo" no seu nome e clicam para assistir.

Quando o Discord se atualizar, o Hugin pode sair junto. Basta abrir o `Hugin.exe` de novo.

Se o Windows mostrar o aviso "O Windows protegeu o computador", clique em **Mais informações** e depois em **Executar assim mesmo**. O aviso aparece porque o executável não é assinado.

## Requisitos

- Windows 10 ou 11.
- Discord para desktop (Estável, PTB ou Canary).
- Todo mundo que vai assistir precisa do Hugin.
- Para o áudio separado (só o aplicativo na janela, tudo menos o Discord na tela inteira), Windows 11. No Windows 10 a transmissão leva o som do PC inteiro, Discord incluído.

## Privacidade e riscos

- O vídeo e o áudio vão por WebRTC direto entre os participantes. A conexão é intermediada pelo VDO.Ninja, que ajuda os PCs a se encontrarem.
- Para mostrar o nome e a foto de quem está transmitindo, o Hugin lê as respostas que o próprio Discord já recebe e pode pedir perfis à API do Discord usando a sua sessão. Para desligar esses pedidos, coloque `"fetchOwnProfile": false` e `"fetchProfiles": false` no `config.json`.
- **Modificar o cliente do Discord vai contra os Termos de Serviço do Discord.** Use por sua conta e risco.

## Desinstalar

Abra um terminal na pasta do executável e rode:

```
Hugin.exe uninstall
```

Isso devolve o Discord ao original. Para apagar também as configurações e os logs, use `Hugin.exe uninstall --purge`.

## Arquivos

Tudo fica em `%APPDATA%\Hugin`:

| Arquivo | Para quê |
|---|---|
| `config.json` | Configurações. Pode ser editado com o Discord fechado. |
| `log.txt` | Log do Hugin dentro do Discord. É o arquivo para mandar quando algo der errado. |
| `install.log` | O que o instalador fez. |

## Opções do instalador

```
Hugin.exe                 instala (mesmo que dar dois cliques)
Hugin.exe status          mostra o estado, sem mudar nada
Hugin.exe uninstall       desinstala
Hugin.exe help            lista todas as opções
```

Algumas opções úteis: `--no-kill` (não fecha o Discord), `--no-launch` (não abre o Discord no final), `--branch=ptb` (escolhe a versão do Discord) e `--debug` (grava logs detalhados e abre a porta de depuração).

## Problemas comuns

- **Não aparece "Ao Vivo" para o meu amigo.** Ele precisa estar no mesmo servidor, com o Hugin instalado na versão mais recente.
- **A tela fica preta ao compartilhar o próprio Discord.** É o efeito de espelho infinito do Windows. Compartilhe outra janela ou a tela inteira.
- **No Windows 10 a transmissão fica perto de 30 fps com a janela coberta.** O Windows 10 limita a captura de janelas que não estão visíveis.
- **Fechei o aplicativo que estava transmitindo.** A transmissão termina sozinha, como no Discord.

## Para desenvolvedores

Precisa de Go e Node.js. Na pasta do projeto:

```
.\build.ps1
```

O executável sai em `dist\Hugin.exe`.
