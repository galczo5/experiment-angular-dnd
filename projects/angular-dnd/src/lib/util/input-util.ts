export class InputUtil {
  static isEnabled(input: boolean | string): boolean {
    return !!input || input === '';
  }
}
