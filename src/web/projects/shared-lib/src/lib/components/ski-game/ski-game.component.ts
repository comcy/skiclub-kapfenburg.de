import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

interface Tree {
    x: number;
    y: number;
}

@Component({
    selector: 'app-ski-game',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ski-game.component.html',
    styleUrls: ['./ski-game.component.scss'],
})
export class SkiGameComponent implements OnInit {
    width = 300;
    height = 500;

    playerX = 130;
    trees: Tree[] = [];
    score = 0;
    gameOver = false;

    ngOnInit() {
        this.spawnTree();
        setInterval(() => this.gameLoop(), 30);
        setInterval(() => this.spawnTree(), 1200);
    }

    gameLoop() {
        if (this.gameOver) return;

        this.trees.forEach((t) => (t.y += 5));
        this.trees = this.trees.filter((t) => t.y < this.height);

        this.checkCollision();
        this.score++;
    }

    spawnTree() {
        if (this.gameOver) return;

        this.trees.push({
            x: Math.random() * (this.width - 40),
            y: -40,
        });
    }

    move(amount: number) {
        this.playerX += amount;
        this.playerX = Math.max(0, Math.min(this.width - 40, this.playerX));
    }

    checkCollision() {
        this.trees.forEach((t) => {
            if (t.y > 400 && t.y < 460 && Math.abs(t.x - this.playerX) < 35) {
                this.gameOver = true;
            }
        });
    }

    restart() {
        this.trees = [];
        this.score = 0;
        this.gameOver = false;
        this.playerX = 130;
    }

    @HostListener('window:keydown', ['$event'])
    onKey(e: KeyboardEvent) {
        if (e.key === 'ArrowLeft') this.move(-20);
        if (e.key === 'ArrowRight') this.move(20);
    }
}
