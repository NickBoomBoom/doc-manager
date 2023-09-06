export class GlobalLoadingService {
  static getDom() {
    return document.querySelector('#loading');
  }
  static show() {
    const el = this.getDom();
    el?.classList.remove('hide');
    el?.classList.add('show');
  }
  static hide() {
    const el = this.getDom();
    el?.classList.remove('show');
    el?.classList.add('hide');
  }
}
