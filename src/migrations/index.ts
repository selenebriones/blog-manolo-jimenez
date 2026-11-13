import * as migration_20261005_185340_inicial from './20261005_185340_inicial';
import * as migration_20261005_193956_quitar_tamanos_de_fotos from './20261005_193956_quitar_tamanos_de_fotos';
import * as migration_20261113_181500_agregar_tiktok from './20261113_181500_agregar_tiktok';

export const migrations = [
  {
    up: migration_20261005_185340_inicial.up,
    down: migration_20261005_185340_inicial.down,
    name: '20261005_185340_inicial',
  },
  {
    up: migration_20261005_193956_quitar_tamanos_de_fotos.up,
    down: migration_20261005_193956_quitar_tamanos_de_fotos.down,
    name: '20261005_193956_quitar_tamanos_de_fotos',
  },
  {
    up: migration_20261113_181500_agregar_tiktok.up,
    down: migration_20261113_181500_agregar_tiktok.down,
    name: '20261113_181500_agregar_tiktok'
  },
];
