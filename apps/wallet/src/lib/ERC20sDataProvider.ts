export type ERC20sData = {
  isApproved: boolean;
};

export class ERC20sDataProvider {
  readErc20sData(): Record<string, ERC20sData> {
    return JSON.parse(localStorage.getItem('erc20s') || '{}');
  }

  setApproved(erc20: string) {
    const erc20sData = this.readErc20sData();
    erc20sData[erc20] = { isApproved: true };
    localStorage.setItem('erc20s', JSON.stringify(erc20sData));
  }

  addErc20sData(erc20: string) {
    const erc20sData = this.readErc20sData();

    if (!erc20sData[erc20]) {
      erc20sData[erc20] = {
        isApproved: false,
      };
    }

    localStorage.setItem('erc20s', JSON.stringify(erc20sData));
  }
}
