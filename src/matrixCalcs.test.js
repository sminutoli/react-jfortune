import { describe, it } from 'mocha';
import expect from 'expect';

import { matrix3dRotateZ, createTransformFromMatrix3d } from './matrixCalcs';

describe('MatrixCalcs', () => {
  describe('matrix3dRotateZ', () => {
    it('should produce a valid string', () => {
      const actual = matrix3dRotateZ(50);
      const expected = '0.9649660284921133,-0.26237485370392877,0,0,0.26237485370392877,0.9649660284921133,0,0,0,0,1,0,0,0,0,1';
      expect(actual).toBe(expected);
    });
  });

  describe('createTransformFromMatrix3d', () => {
    it('should produce a valid string', () => {
      const matrix3d = matrix3dRotateZ(50);
      const actual = createTransformFromMatrix3d(matrix3d);
      const expected = {
        WebkitTransform: 'matrix3d(0.9649660284921133,-0.26237485370392877,0,0,0.26237485370392877,0.9649660284921133,0,0,0,0,1,0,0,0,0,1)',
        transform: 'matrix3d(0.9649660284921133,-0.26237485370392877,0,0,0.26237485370392877,0.9649660284921133,0,0,0,0,1,0,0,0,0,1)'
      };
      expect(actual).toEqual(expected);
    });
  });
});
