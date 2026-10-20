import { describe, expect, it } from '@jest/globals';
import { clientTabs } from '../src/navigation/clientTabs';

describe('clientTabs', () => {
  it('exposes home, history and account in the bottom bar', () => {
    expect(clientTabs.map((tab) => tab.name)).toEqual([
      'Routines',
      'History',
      'Profile',
    ]);
    expect(clientTabs.map((tab) => tab.title)).toEqual([
      'Inicio',
      'Historial',
      'Cuenta',
    ]);
  });

  it('gives every tab an icon for each state', () => {
    clientTabs.forEach((tab) => {
      expect(tab.icon).toBeTruthy();
      expect(tab.iconActive).toBeTruthy();
    });
  });
});
