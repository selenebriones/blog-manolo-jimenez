import * as migration_20261005_185340_inicial from './20261005_185340_inicial';

export const migrations = [
  {
    up: migration_20261005_185340_inicial.up,
    down: migration_20261005_185340_inicial.down,
    name: '20261005_185340_inicial'
  },
];
