// Define a cena principal
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Main' }); // Define a chave da cena
    }

    // Pré-carrega os assets do jogo
    preload() {
        this.load.image('cartaParaBaixo', 'assets/card_back.png'); // Pré-carrega a imagem da carta para baixo
        this.load.image('card_0_0', 'assets/card_0_0.png');
        this.load.image('card_0_', 'assets/card_0_.png');
        this.load.image('card_1_1', 'assets/card_1_1.png');
        this.load.image('card_1', 'assets/card_1.png');
        this.load.image('card_2_2', 'assets/card_2_2.png');
        this.load.image('card_2', 'assets/card_2.png');
        this.load.image('card_3_3', 'assets/card_3_3.png');
        this.load.image('card_3', 'assets/card_3.png');
        this.load.image('card_4_4', 'assets/card_4_4.png');
        this.load.image('card_4', 'assets/card_4.png');
        this.load.image('card_5_5', 'assets/card_5_5.png');
        this.load.image('card_5', 'assets/card_5.png');
        this.load.image('coracao', 'assets/coracao.jpg'); // Pré-carrega a imagem do coração
        this.load.image('background', 'assets/background.png');

    }

    // Cria os elementos do jogo
    create() {
        this.add.image(400, 300, 'background').setScale(1); // Ajuste a posição e a escala conforme necessário
        let firstCard = null; // Armazena a primeira carta selecionada
        let secondCard = null; // Armazena a segunda carta selecionada
        let cards = null; // Armazena as cartas disponíveis no jogo
        let cardPositions = {}; // Mapeia as posições das cartas no tabuleiro
        let checkingPair = false; // Variável de controle para verificar pares
        let lives = 5; // Vidas do jogador
        let heartImages = []; // Imagens dos corações

        // Cria as imagens dos corações na tela
        const heartSpacing = 40; // Espaçamento entre os corações
        for (let i = 0; i < lives; i++) {
            const heart = this.add.image(250 + i * (30 + heartSpacing), 50, 'coracao').setScale(0.05);
            heartImages.push(heart); // Adiciona a imagem do coração ao array
        }

        // Define os nomes das cartas e embaralha
        cards = ['card_0_0', 'card_0_', 'card_1_1', 'card_1', 'card_2_2', 'card_2', 'card_3_3', 'card_3', 'card_4_4', 'card_4', 'card_5_5', 'card_5']; // Nomes das cartas (cada par de cartas tem um número correspondente)


        // Configurações do layout das cartas
        const cardSpacingX = 150; // Espaçamento horizontal entre as cartas
        const cardSpacingY = 150; // Espaçamento vertical entre as cartas
        const maxCardWidth = 130; // Largura máxima da carta
        const rows = 3; // Quantidade de fileiras de cartas
        const cols = 4; // Quantidade de cartas por fileira

        // Calcula as posições iniciais das cartas no tabuleiro
        const totalCardWidth = cols * maxCardWidth * 0.5 + (cols - 1) * cardSpacingX; // Largura total das cartas
        const totalEmptySpaceX = this.sys.game.config.width - totalCardWidth; // Espaço vazio horizontal
        const xOffset = totalEmptySpaceX / 2 + maxCardWidth * 0.75; // Deslocamento horizontal

        const totalCardHeight = rows * maxCardWidth * 0.5 + (rows - 1) * cardSpacingY; // Altura total das cartas
        const totalEmptySpaceY = this.sys.game.config.height - totalCardHeight; // Espaço vazio vertical
        const yOffset = totalEmptySpaceY / 2 + maxCardWidth * 0.75; // Deslocamento vertical

        // Posições iniciais das cartas no tabuleiro
        let startX = xOffset; // Posição inicial horizontal
        let startY = yOffset; // Posição inicial vertical

        Phaser.Utils.Array.Shuffle(cards); // Embaralha as cartas

        // Cria as cartas no tabuleiro
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const card = this.add.image(startX + j * cardSpacingX, startY + i * cardSpacingY, 'cartaParaBaixo').setScale(1); // Cria a carta

                // Redimensiona a carta se necessário
                if (card.width > maxCardWidth) {
                    card.setScale(maxCardWidth / card.width * 1);
                }

                card.setInteractive(); // Torna as cartas interativas
                card.on('pointerdown', function () { // Adiciona um evento de clique
                    if (!checkingPair && card.texture.key === 'cartaParaBaixo') { // Verifica se não está verificando um par
                        const cardIndex = i * cols + j; // Calcula o índice da carta
                        if (!cardPositions[cardIndex]) { // Verifica se a carta já foi selecionada
                            cardPositions[cardIndex] = cards.pop(); // Atribui a carta selecionada à posição no tabuleiro
                        }
                        card.setTexture(cardPositions[cardIndex]); // Define a textura da carta

                        // Redimensiona a carta virada para cima para manter o mesmo tamanho
                        if (card.texture.key !== 'cartaParaBaixo') {
                            card.setScale(1);
                        }

                        // Verifica se a carta é a primeira ou a segunda do par
                        if (!firstCard) {
                            firstCard = card; // Define a carta como a primeira do par
                        } else { // Se a carta não é a primeira, é a segunda
                            secondCard = card; // Define a carta como a segunda do par
                            checkingPair = true; // Define como true quando inicia a verificação do par

                            if (firstCard.texture.key === secondCard.texture.key) { // Verifica se as cartas são iguais
                                // As cartas são iguais, o jogador pode continuar
                                firstCard = null; // Define a primeira carta como nula
                                secondCard = null; // Define a segunda carta como nula
                                checkingPair = false; // Define como false quando a verificação do par termina
                            } else {
                                // As cartas não são iguais, volte à posição original
                                setTimeout(function () {
                                    firstCard.setTexture('cartaParaBaixo'); // Define a textura da primeira carta como a carta para baixo
                                    firstCard.setScale(1); // Redefine o tamanho da primeira carta para o tamanho correto
                                    secondCard.setTexture('cartaParaBaixo'); // Define a textura da segunda carta como a carta para baixo
                                    secondCard.setScale(1); // Redefine o tamanho da segunda carta para o tamanho correto
                                    firstCard = null; // Define a primeira carta como nula
                                    secondCard = null; // Define a segunda carta como nula
                                    checkingPair = false; // Define como false quando a verificação do par termina

                                    // O jogador perde uma vida
                                    lives--;
                                    heartImages[lives].destroy(); // Remove a imagem do coração
                                    if (lives === 0) {
                                        // O jogador perdeu
                                        this.scene.start('GameOver'); // Chama a cena de Game Over
                                    }
                                }.bind(this), 3000); // Define um tempo de espera de 1 segundo

                            }
                        }
                    }
                }.bind(this)); //  Define o contexto da função de clique
            }
        }
    }
}

// Define a cena de Game Over
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' }); // Define a chave da cena
    }

    // Cria os elementos da cena de Game Over
    create() {
        // Texto de Game Over
        this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        // Botão de Recomeçar
        const restartButton = this.add.text(400, 400, 'Recomeçar', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            // Reinicie o jogo chamando a cena principal novamente
            this.scene.start('Main');
        });
    }
}

// Configuração do jogo
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene, GameOverScene] // Adiciona as cenas ao jogo
};

// Cria o jogo
const game = new Phaser.Game(config);