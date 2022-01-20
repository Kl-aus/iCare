export class RecommendationModel {
  private name: string;
  private author: string;


  constructor(_name: string, _author: string) {
    this.name = _name;
    this.author = _author;
  }

  get _name(): string {
    return this.name;
  }

  set _name(value: string) {
    this.name = value;
  }

  get _author(): string {
    return this.author;
  }

  set _author(value: string) {
    this.author = value;
  }
}
