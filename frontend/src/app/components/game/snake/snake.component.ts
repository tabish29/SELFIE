import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit, AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gridSize = 12; 
  private tileSize = 36; 
  private snake: { x: number, y: number }[] = [{ x: 5, y: 5 }];
  private food = { x: 0, y: 0 };
  private dx = 0;
  private dy = 0;
  public score = 0;
  private gameInterval: any;
  private appleImage: HTMLImageElement | undefined;
  private snakeHeadImage: HTMLImageElement | undefined;
  private speed = 250;
  public gameOver: boolean = false;

  ngOnInit(): void {
    this.initializeFoodPosition();
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.canvas.width = this.gridSize * this.tileSize;
      this.canvas.height = this.gridSize * this.tileSize;

      this.appleImage = new Image();
      this.appleImage.src = 'assets/apple.png';

      this.snakeHeadImage = new Image();
      this.snakeHeadImage.src = 'assets/snake_head.png';

      this.appleImage.onload = () => {
        if (this.snakeHeadImage) {
          this.snakeHeadImage.onload = () => {
            this.startGame();
          };
        } else {
          this.startGame();
        }
      };
    }
  }

  private startGame(): void {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (this.dy === 0) {
            this.dx = 0;
            this.dy = -1;
            e.preventDefault(); // Previene il comportamento predefinito della freccia su
          }
          break;
        case 'ArrowDown':
          if (this.dy === 0) {
            this.dx = 0;
            this.dy = 1;
            e.preventDefault(); // Previene il comportamento predefinito della freccia giù
          }
          break;
        case 'ArrowLeft':
          if (this.dx === 0) {
            this.dx = -1;
            this.dy = 0;
            e.preventDefault(); // Previene il comportamento predefinito della freccia sinistra
          }
          break;
        case 'ArrowRight':
          if (this.dx === 0) {
            this.dx = 1;
            this.dy = 0;
            e.preventDefault(); // Previene il comportamento predefinito della freccia destra
          }
          break;
      }
    });
  
    this.gameInterval = setInterval(() => {
      this.update();
      this.draw();
    }, this.speed);
  }
  

  private initializeFoodPosition(): void {
    this.food = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    };

    for (const segment of this.snake) {
      if (this.food.x === segment.x && this.food.y === segment.y) {
        this.initializeFoodPosition();
        return;
      }
    }
  }

  private draw(): void {
    if (!this.appleImage || !this.snakeHeadImage) return; 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Disegna il corpo del serpente come un filo continuo
    const bodyWidth = this.tileSize * 0.5;

    this.ctx.strokeStyle = '#228B22'; // Colore verde per il corpo
    this.ctx.lineWidth = bodyWidth;
    this.ctx.lineCap = 'round'; // Per rendere il corpo più realistico

    this.ctx.beginPath();

    // Partenza dalla testa
    this.ctx.moveTo(
      this.snake[0].x * this.tileSize + this.tileSize / 2,
      this.snake[0].y * this.tileSize + this.tileSize / 2
    );

    // Tracciare il corpo del serpente lungo i segmenti
    for (let i = 1; i < this.snake.length; i++) {
      const segment = this.snake[i];
      const previousSegment = this.snake[i - 1];

      // Controlla se il serpente attraversa un bordo della griglia
      if (Math.abs(segment.x - previousSegment.x) > 1 || Math.abs(segment.y - previousSegment.y) > 1) {
        // Interrompe la linea se attraversa il bordo
        this.ctx.moveTo(
          segment.x * this.tileSize + this.tileSize / 2,
          segment.y * this.tileSize + this.tileSize / 2
        );
      } else {
        // Continua a tracciare la linea
        this.ctx.lineTo(
          segment.x * this.tileSize + this.tileSize / 2,
          segment.y * this.tileSize + this.tileSize / 2
        );
      }
    }

    this.ctx.stroke();

    // Disegna la testa del serpente
    const head = this.snake[0];
    this.ctx.drawImage(
      this.snakeHeadImage,
      head.x * this.tileSize,
      head.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );

    // Disegna la mela
    this.ctx.drawImage(
      this.appleImage,
      this.food.x * this.tileSize,
      this.food.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );

    // Disegna il punteggio
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, this.canvas.height - 10);
  }

  private update(): void {
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
  
    // Wrap around logic
    if (head.x < 0) head.x = this.gridSize - 1;
    if (head.x >= this.gridSize) head.x = 0;
    if (head.y < 0) head.y = this.gridSize - 1;
    if (head.y >= this.gridSize) head.y = 0;
  
    // Controlla se il serpente ha mangiato la coda solo se ha più di 1 segmento
    if (this.snake.length > 1 && this.snake.some(segment => head.x === segment.x && head.y === segment.y)) {
      this.gameOver = true;  // Imposta la variabile gameOver a true
      clearInterval(this.gameInterval);  // Ferma il gioco
      return;
    }
  
    // Controlla se il serpente ha mangiato la mela
    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.unshift(head); // Aggiunge un segmento
      this.score++;
      this.placeFood();
      this.adjustSpeed(); 
    } else {
      this.snake.unshift(head);
      this.snake.pop(); // Rimuove l'ultimo segmento
    }
  }
  

  private placeFood(): void {
    this.food = {
      x: Math.floor(Math.random() * this.gridSize),
      y: Math.floor(Math.random() * this.gridSize)
    };

    for (const segment of this.snake) {
      if (this.food.x === segment.x && this.food.y === segment.y) {
        this.placeFood();
        return;
      }
    }
  }

  private adjustSpeed(): void {
    if (this.score % 5 === 0) {
      this.speed = Math.max(50, this.speed * 0.7); 
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(() => {
        this.update();
        this.draw();
      }, this.speed);
    }
  }

  public resetGame(): void {
    clearInterval(this.gameInterval);
    this.snake = [{ x: 5, y: 5 }]; // Resetta il serpente con un solo segmento
    this.dx = 0; // Fermo inizialmente
    this.dy = 0;
    this.score = 0;
    this.speed = 250; 
    this.gameOver = false; // Chiude il pop-up di sconfitta
    this.initializeFoodPosition();
    if (this.appleImage && this.snakeHeadImage) {
      this.gameInterval = setInterval(() => {
        this.update();
        this.draw();
      }, this.speed);
    }
  }  
}
