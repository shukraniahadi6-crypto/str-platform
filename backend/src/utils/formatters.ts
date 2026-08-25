export const sanitizeEntity = <T extends { toJSON?: () => unknown }>(entity: T): unknown => {
  if (entity && typeof entity.toJSON === 'function') {
    return entity.toJSON();
  }
  return entity;
};
