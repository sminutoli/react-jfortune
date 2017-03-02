function matrix3dRotateZ(angle) {
  const matrix = [
    [Math.cos(angle), Math.sin(angle), 0, 0],
    [Math.sin(-angle), Math.cos(angle), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  const createMatrix = (acc, val, i) => acc + (i > 0 ? ',' : '') + val.join(',');
  return matrix.reduce(createMatrix, '');
}

function createTransformFromMatrix3d(matrix3d) {
  const matrix3dRule = `matrix3d(${matrix3d})`;
  return {
    transform: matrix3dRule,
    WebkitTransform: matrix3dRule
  };
}

export {
  matrix3dRotateZ,
  createTransformFromMatrix3d
};
