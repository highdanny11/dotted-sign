import { fabric } from 'fabric';

const renderCloseBtn = (
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  _styleOverride: any,
  faricObject: fabric.Object
) => {
  const img = document.createElement('img');

  const deleteIcon =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMzMzhfMTQ2MjEpIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxXzMzMzhfMTQ2MjEpIj4KPHBhdGggZD0iTTggOEg0MFY0MEg4VjhaIiBmaWxsPSIjMEI3RDc3Ii8+CjxwYXRoIGQ9Ik0zMy4zMzM0IDI1LjMzMzJIMTQuNjY2N1YyMi42NjY1SDMzLjMzMzRWMjUuMzMzMloiIGZpbGw9IndoaXRlIi8+CjwvZz4KPHBhdGggZD0iTTM4IDEwVjM4SDEwVjEwSDM4Wk0zOCA2SDEwQzcuOCA2IDYgNy44IDYgMTBWMzhDNiA0MC4yIDcuOCA0MiAxMCA0MkgzOEM0MC4yIDQyIDQyIDQwLjIgNDIgMzhWMTBDNDIgNy44IDQwLjIgNiAzOCA2WiIgZmlsbD0iIzBCN0Q3NyIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzMzMzhfMTQ2MjEiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMzMzOF8xNDYyMSI+CjxyZWN0IHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDggOCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";

  img.src = deleteIcon;
  const size = 30;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(faricObject.angle!));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
};
const deleteObject = (
  _eventData: MouseEvent,
  transformData: fabric.Transform
) => {
  const target = transformData.target;
  if (target) {
    target.canvas?.remove(target);
    target.canvas?.requestRenderAll();
  }

  return true;
};

export function setFabricDeleteControl() {
  return new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -20,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderCloseBtn,
  });
}