import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit, AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private gridSize = 10; // Griglia più piccola
  private tileSize = 40; // Caselle più grandi
  private snake: { x: number, y: number }[] = [{ x: 5, y: 5 }];
  private food = { x: 0, y: 0 };
  private dx = 0;
  private dy = 0;
  public score = 0;
  private gameInterval: any;
  private appleImage: HTMLImageElement | undefined;
  private snakeImage: HTMLImageElement | undefined;
  private speed = 200; // Velocità iniziale (200 ms per frame)

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

      this.snakeImage = new Image();
      this.snakeImage.src = 'assets/snake.png';

      // Assegna l'handler di onload solo se le immagini sono caricate
      this.appleImage.onload = () => {
        if (this.snakeImage) {
          this.snakeImage.onload = () => {
            this.startGame();
          };
        } else {
          this.startGame(); // Fall back se l'immagine del serpente non è definita
        }
      };
    }
  }

  private startGame(): void {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (this.dy === 0) { this.dx = 0; this.dy = -1; }
          break;
        case 'ArrowDown':
          if (this.dy === 0) { this.dx = 0; this.dy = 1; }
          break;
        case 'ArrowLeft':
          if (this.dx === 0) { this.dx = -1; this.dy = 0; }
          break;
        case 'ArrowRight':
          if (this.dx === 0) { this.dx = 1; this.dy = 0; }
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
    if (!this.appleImage || !this.snakeImage) return; // Assicurati che le immagini siano caricate
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw snake
    for (const segment of this.snake) {
      this.ctx.drawImage(
        this.snakeImage,
        segment.x * this.tileSize,
        segment.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }

    // Draw food (apple image)
    this.ctx.drawImage(
      this.appleImage,
      this.food.x * this.tileSize,
      this.food.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );

    // Draw score
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

    if (this.snake.some(segment => head.x === segment.x && head.y === segment.y)) {
      this.resetGame();
      return;
    }

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.unshift(head);
      this.score++;
      this.placeFood();
      this.adjustSpeed(); // Aumenta la velocità del gioco
    } else {
      this.snake.unshift(head);
      this.snake.pop();
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
      this.speed = Math.max(50, this.speed * 0.9); // Aumenta la velocità del 10% ogni 5 punti
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(() => {
        this.update();
        this.draw();
      }, this.speed);
    }
  }

  public resetGame(): void {
    clearInterval(this.gameInterval);
    this.snake = [{ x: 5, y: 5 }];
    this.dx = 0;
    this.dy = 0;
    this.score = 0;
    this.speed = 200; // Reset della velocità iniziale
    this.initializeFoodPosition();
    if (this.appleImage && this.snakeImage) {
      this.gameInterval = setInterval(() => {
        this.update();
        this.draw();
      }, this.speed);
    }
  }
}
