import {
  AnimationBuilder,
  animate,
  keyframes,
  transition,
  style,
  AnimationKeyframesSequenceMetadata,
  AnimationPlayer
} from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  @Input() animationSeconds: number = 1;
  @Input() number: number = 4;

  public readonly counterArray = new Array(11)
    .fill(0)
    .map((_, index) => (index === 10 ? 0 : index));

  public style = {};

  public animateCounter: boolean = false;
  public animation: AnimationPlayer | null = null;
  public animateElement: HTMLElement | null = null;

  constructor(private animationBuilder: AnimationBuilder) {}

  public startCounter(element: HTMLDivElement): void {
    console.log('startCounter');
    this.animateCounter = true;
    this.animateElement = element;
    this.animateFirst();
  }

  public stopCounter(): void {
    this.animateCounter = false;
  }

  private animate(element: HTMLElement): void {
    console.log('animate');
    if (!this.animateCounter) {
      this.animateLast();
      return;
    }

    if (!this.animation) {
      return;
    }

    this.animateLoop();
  }

  private animateFirst(): void {
    console.log('animateFirst');
    const animPlayer = this.animationBuilder
      .build(
        animate(
          `${this.animationSeconds}s ease-in`,
          this.getAnimationKeyframes()
        )
      )
      .create(this.animateElement);

    animPlayer.onDone(this.animateLoop.bind(this));
    animPlayer.play();

    this.animation = animPlayer;
  }

  private animateLoop(): void {
    console.log('animateLoop');

    this.animation.destroy();

    const animPlayer = this.animationBuilder
      .build(
        animate(
          `${this.animationSeconds * 0.75}s linear`,
          this.getAnimationKeyframes()
        )
      )
      .create(this.animateElement);

    animPlayer.onDone(this.animate.bind(this));

    this.animation = animPlayer;

    this.animation.play();
  }

  private animateLast(): void {
    console.log('animateLast');
    this.animation.destroy();
    this.animation = null;

    const animPlayer = this.animationBuilder
      .build(
        animate(
          `${this.animationSeconds}s ease-out`,
          this.getAnimationKeyframes(true)
        )
      )
      .create(this.animateElement);

    animPlayer.play();
  }

  private getAnimationKeyframes(
    useNumber: boolean = false
  ): AnimationKeyframesSequenceMetadata {
    return keyframes([
      style({ transform: 'translateY(0rem)' }),
      style({
        transform: `translateY(calc(-100% + 1rem))`
      })
    ]);
  }
}
