export type Vector = {
  x: number;
  y: number;
};

export const add = (a: Vector, b: Vector): Vector => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const sub = (a: Vector, b: Vector): Vector => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

export const dot = (a: Vector, b: Vector): number => a.x * b.x + a.y * b.y;

export const scale = (a: Vector, f: number): Vector => ({
  x: f * a.x,
  y: f * a.y,
});

export const length = (a: Vector): number => Math.sqrt(a.x * a.x + a.y * a.y);

export const unit = (a: Vector): Vector => scale(a, 1 / length(a));

export const mean = (vs: Vector[]): Vector =>
  scale(vs.reduce(add, { x: 0, y: 0 }), 1 / vs.length);
