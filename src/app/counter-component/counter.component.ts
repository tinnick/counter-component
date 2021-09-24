import {
  AnimationBuilder,
  animate,
  keyframes,
  style,
  AnimationPlayer,
  query,
} from '@angular/animations';
import { Component, Input, ElementRef, OnInit } from '@angular/core';

declare interface ISequenceClasses {
  digits: string[];
  decimals: string[];
}

declare interface IFromToSequenceNumbers {
  from: ISequenceNumber;
  to: ISequenceNumber;
}

declare interface ISequenceNumber {
  digits: number[];
  decimals: number[];
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {
  @Input() animationSeconds: number = 1;
  @Input() from: number = 0.0384;
  @Input() to: number = 60.123;
  @Input() decimalPlaces: number = 2;
  @Input() isTimeCounter: boolean = true;

  public readonly counterArray = new Array(11)
    .fill(0)
    .map((_, index) => (index === 10 ? 0 : index));
  public readonly counterTimeArray = new Array(7)
    .fill(0)
    .map((_, index) => (index === 6 ? 0 : index));

  public digits: number[] = this.getDigits();
  public decimals: number[] = this.getDecimals();
  public sequenceNumbers: IFromToSequenceNumbers = this.buildSequenceNumbers();
  public sequenceClasses: ISequenceClasses = this.buildSequenceClasses();

  public animateCounter: boolean = false;
  public animation: AnimationPlayer | null = null;
  public animateElement: HTMLElement | null = null;

  public get element(): HTMLElement {
    return this.elementRef && this.elementRef.nativeElement;
  }

  constructor(
    private animationBuilder: AnimationBuilder,
    private elementRef: ElementRef
  ) {}

  public ngOnInit(): void {
    this.startCounter();
  }

  public startCounter(): void {
    this.digits = this.getDigits();
    this.decimals = this.getDecimals();

    this.sequenceNumbers = this.buildSequenceNumbers();
    this.sequenceClasses = this.buildSequenceClasses();

    const [diffDigits, diffDecimals] = String(this.to - this.from)
      .slice(0, this.digits.length + this.decimalPlaces + 1)
      .split('.')
      .map((str) =>
        str
          .split('')
          .map((_, index, array) =>
            index === 0 ? '0' : array.slice(0, index).join('')
          )
      );

    const sequences = [];

    diffDigits.forEach((numString, index) => {
      const klass = this.sequenceClasses.digits[index];
      const num = +numString;
      const anims = [];

      if (num) {
        const fromSequence = this.sequenceNumbers.from.digits[index];
        const toSequence = this.sequenceNumbers.to.digits[index];

        const fromToLoopOffset = (1 - fromSequence / 10) / num;
        const loopToToOffset = (1 - toSequence / 10) / num;

        const animSegment = (1 - fromToLoopOffset - loopToToOffset) / num;

        anims.push([
          style({ transform: `translateY(-${fromSequence}em)`, offset: 0 }),
          style({ transform: 'translateY(-10em)', offset: fromToLoopOffset }),
        ]);

        for (let i = 0; i <= num; i++) {
          const startOffset = i * animSegment;
          const endOffset = startOffset + animSegment;

          anims.push([
            style({ transform: `translateY(0em)`, offset: startOffset }),
            style({ transform: 'translateY(-10em)', offset: endOffset }),
          ]);
        }

        anims.push([
          style({ transform: 'translateY(0em)', offset: 1 - loopToToOffset }),
          style({ transform: `translateY(-${toSequence}em)`, offset: 1 }),
        ]);
      }

      sequences.push(
        query(
          klass,
          animate(
            `${this.animationSeconds}s ease-in-out`,
            keyframes([...anims])
          ),
          { optional: true }
        )
      );
    });

    const diffDecimalsBase = diffDigits.join('');

    diffDecimals.forEach((numString, index) => {
      const klass = this.sequenceClasses.decimals[index];
      const num = +(diffDecimalsBase + numString);
      const anims = [];

      if (num) {
        const fromSequence = this.sequenceNumbers.from.decimals[index];
        const toSequence = this.sequenceNumbers.to.decimals[index];

        const fromToLoopOffset = (1 - fromSequence / 10) / num;
        const loopToToOffset = (1 - toSequence / 10) / num;

        const animSegment = (1 - fromToLoopOffset - loopToToOffset) / num;

        anims.push([
          style({ transform: `translateY(-${fromSequence}em)`, offset: 0 }),
          style({ transform: 'translateY(-10em)', offset: fromToLoopOffset }),
        ]);

        for (let i = 0; i <= num; i++) {
          const startOffset = i * animSegment;
          const endOffset = startOffset + animSegment;

          anims.push([
            style({ transform: `translateY(0em)`, offset: startOffset }),
            style({ transform: 'translateY(-10em)', offset: endOffset }),
          ]);
        }

        anims.push([
          style({ transform: 'translateY(0em)', offset: 1 - loopToToOffset }),
          style({ transform: `translateY(-${toSequence}em)`, offset: 1 }),
        ]);
      }

      sequences.push(
        query(
          klass,
          animate(
            `${this.animationSeconds}s ease-in-out`,
            keyframes([...anims])
          ),
          { optional: true }
        )
      );
    });

    this.animationBuilder.build(sequences).create(this.element).play();
  }

  private getDigits(): number[] {
    return new Array(parseInt(String(this.to), 10)).fill(0);
  }

  private getDecimals(): number[] {
    return new Array(this.decimalPlaces).fill(0);
  }

  private buildSequenceNumbers(): IFromToSequenceNumbers {
    const [fromDigits, fromDecimals] = String(this.from).split('.');
    const [toDigits, toDecimals] = String(this.to).split('.');

    return {
      from: {
        digits: this.digits
          .slice(0, this.digits.length - fromDigits.length)
          .concat([...fromDigits].map(Number)),
        decimals: this.decimals
          .slice(0, this.decimals.length - fromDecimals.length)
          .concat([...fromDecimals].map(Number)),
      },
      to: {
        digits: this.digits
          .slice(0, this.digits.length - toDigits.length)
          .concat([...toDigits].map(Number)),
        decimals: this.decimals
          .slice(0, this.decimals.length - toDecimals.length)
          .concat([...toDecimals].map(Number)),
      },
    };
  }

  private buildSequenceClasses(): ISequenceClasses {
    return {
      digits: this.sequenceNumbers.to.digits.map(
        (_, index, { length }) =>
          `digit-${new Array(length - index).fill(0).join('')}`
      ),
      decimals: this.sequenceNumbers.to.decimals.map(
        (_, index) => `decimal-${new Array(index + 1).fill(0)}`
      ),
    };
  }
}
