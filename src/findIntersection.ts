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
  let k1 = (Math.round(y21) - Math.round(y11)) / (Math.round(x21) - Math.round(x11));
  let b1 = Math.round(y11) - ((Math.round(y21) - Math.round(y11)) / (Math.round(x21) - Math.round(x11)) * Math.round(x11));

  let k2 = (Math.round(y22) -Math.round(y12)) / (Math.round(x22) - Math.round(x12));
  let b2 = Math.round(y12) - ((Math.round(y22) - Math.round(y12)) / (Math.round(x22) - Math.round(x12)) * Math.round(x12));

  let x = Math.round((b2 - b1) / (k1 - k2));

  let y = Math.round((k1 * x + b1));

  const xDif1 = Math.round(x21) - Math.round(x11);
  const xDif2 = Math.round(x22) - Math.round(x12);
  const yDif1 = Math.round(y21) - Math.round(y11);
  const yDif2 = Math.round(y22) - Math.round(y12);

  const distDistX11 = Math.round(x21) - Math.round(x);
  const distDistX12 = Math.round(x11) - Math.round(x);
  const distDistY11 = Math.round(y21) - Math.round(y);
  const distDistY12 = Math.round(y11) - Math.round(y);

  const distDistX21 = Math.round(x12) - Math.round(x);
  const distDistX22 = Math.round(x22) - Math.round(x);
  const distDistY21 = Math.round(y12) - Math.round(y);
  const distDistY22 = Math.round(y22) - Math.round(y);

  const lenght1 = Math.round(Math.sqrt(Math.abs(Math.round((xDif1 ** 2)) + Math.round((yDif1 ** 2)))));
  const lenght2 = Math.round(Math.sqrt(Math.round(Math.abs(Math.round((xDif2 ** 2)) + (yDif2 ** 2)))));

  const distToPoint11 = Math.round(Math.sqrt(Math.round(Math.abs((distDistX11 ** 2) + (distDistY11 ** 2)))));
  const distToPoint12 = Math.round(Math.sqrt(Math.round(Math.abs((distDistX12 ** 2) + (distDistY12 ** 2)))));

  const distToPoint21 = Math.round(Math.sqrt(Math.round(Math.abs((distDistX21 ** 2) + (distDistY21 ** 2)))));
  const distToPoint22 = Math.round(Math.sqrt(Math.round(Math.abs((distDistX22 ** 2) + (distDistY22 ** 2)))));

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