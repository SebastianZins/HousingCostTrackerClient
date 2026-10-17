export class Place {
  id: string = crypto.randomUUID();
  name: string = '?';

  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }
}
