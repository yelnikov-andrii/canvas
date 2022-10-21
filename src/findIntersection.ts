export const findIntersection = (
  x11: number, 
  y11: number, 
  x21: number, 
  y21: number, 
  x12: number, 
  y12: number, 
  x22: number, 
  y22: number
) => {
  let k1 = (Math.ceil(y21) - Math.ceil(y11)) / (Math.ceil(x21) - Math.ceil(x11));
  let b1 = Math.ceil(y11) - ((Math.ceil(y21) - Math.ceil(y11)) / (Math.ceil(x21) - Math.ceil(x11)) * Math.ceil(x11));

  let k2 = (Math.ceil(y22) -Math.ceil(y12)) / (Math.ceil(x22) - Math.ceil(x12));
  let b2 = Math.ceil(y12) - ((Math.ceil(y22) - Math.ceil(y12)) / (Math.ceil(x22) - Math.ceil(x12)) * Math.ceil(x12));

  let x = Math.ceil((b2 - b1) / (k1 - k2));

  let y = Math.ceil((k1 * x + b1));

  const xDif1 = Math.ceil(x21) - Math.ceil(x11);
  const xDif2 = Math.ceil(x22) - Math.ceil(x12);
  const yDif1 = Math.ceil(y21) - Math.ceil(y11);
  const yDif2 = Math.ceil(y22) - Math.ceil(y12);

  const distDistX11 = Math.ceil(x21) - Math.ceil(x);
  const distDistX12 = Math.ceil(x11) - Math.ceil(x);
  const distDistY11 = Math.ceil(y21) - Math.ceil(y);
  const distDistY12 = Math.ceil(y11) - Math.ceil(y);

  const distDistX21 = Math.ceil(x12) - Math.ceil(x);
  const distDistX22 = Math.ceil(x22) - Math.ceil(x);
  const distDistY21 = Math.ceil(y12) - Math.ceil(y);
  const distDistY22 = Math.ceil(y22) - Math.ceil(y);

  const lenght1 = Math.ceil(Math.sqrt(Math.abs(Math.ceil((xDif1 ** 2)) + Math.ceil((yDif1 ** 2)))));
  const lenght2 = Math.ceil(Math.sqrt(Math.ceil(Math.abs(Math.ceil((xDif2 ** 2)) + (yDif2 ** 2)))));

  const distToPoint11 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX11 ** 2) + (distDistY11 ** 2)))));
  const distToPoint12 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX12 ** 2) + (distDistY12 ** 2)))));

  const distToPoint21 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX21 ** 2) + (distDistY21 ** 2)))));
  const distToPoint22 = Math.ceil(Math.sqrt(Math.ceil(Math.abs((distDistX22 ** 2) + (distDistY22 ** 2)))));

  const distToPoint1 = distToPoint11 + distToPoint12;
  const distToPoint2 = distToPoint21 + distToPoint22;

  if (Math.abs(lenght1 - distToPoint1) > 1 || Math.abs(lenght2 - distToPoint2) > 1) {
    return;
  }

  const point = {
    x,
    y
  };

  return point;
}