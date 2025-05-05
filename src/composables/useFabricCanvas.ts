// -----------------------------------------------------------
// useFabricCanvas.ts – Fabric helpers with zero TS errors
// -----------------------------------------------------------
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import * as fabric from 'fabric'            // works with "esModuleInterop": true

/* ────────── Public API ────────── */
export interface UseFabricCanvasApi {
  canvasEl: Ref<HTMLCanvasElement | null>
  addRect(): void
  addPolygon(): void
  deleteSelection(): void
  hasSelection(): boolean
}

export function useFabricCanvas (): UseFabricCanvasApi {
  /* DOM handle */
  const canvasEl = ref<HTMLCanvasElement | null>(null)

  /* Fabric canvas instance – assigned in onMounted */
  let canvas!: fabric.Canvas

  /* Track polygons whose vertex‑edit mode is ON */
  const editingPolys = new WeakSet<fabric.Polygon>()

  /* ——— LIFE‑CYCLE ——— */
  onMounted((): void => {
    canvas = new fabric.Canvas(canvasEl.value as HTMLCanvasElement, {
      selection: true,
      preserveObjectStacking: true
    })

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Canvas‑level events we want to observe
    type LogEvt =
      | 'object:added' | 'object:modified'
      | 'selection:created' | 'selection:updated' | 'selection:cleared'

    const log = (name: LogEvt, ev: fabric.IEvent): void =>
      console.info(`[Fabric] ${name}`, ev)          // eslint-disable-line no-console

    ;(['object:added',
       'object:modified',
       'selection:created',
       'selection:updated',
       'selection:cleared'] as LogEvt[])
      .forEach((evt: LogEvt) => canvas.on(evt, (e: fabric.IEvent) => log(evt, e)))

    // dbl‑click isn’t in the typings → cast through any
    (canvas as any).on('mouse:dblclick', handleDblClick)
  })

  onUnmounted(() => window.removeEventListener('resize', resizeCanvas))

  /* ——— PUBLIC ACTIONS ——— */
  function addRect (): void {
    const rect = new fabric.Rect({
      left: rand(50, 400),
      top: rand(50, 250),
      width: 120,
      height: 80,
      rx: 6, ry: 6,
      fill: randomColor()
    })
    canvas.add(rect).setActiveObject(rect)
  }

  function addPolygon (): void {
    const r = 50
    const points: fabric.Point[] = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i
      return new fabric.Point(r * Math.cos(a), r * Math.sin(a))
    })

    const poly = new fabric.Polygon(points, {
      left: rand(100, 500),
      top: rand(100, 400),
      fill: randomColor(),
      stroke: '#000',
      strokeWidth: 1
    })
    canvas.add(poly).setActiveObject(poly)
  }

  function deleteSelection (): void {
    const active = canvas.getActiveObject()
    if (!active) return

    if (active.type === 'activeSelection') {
      (active as fabric.ActiveSelection).forEachObject(obj => canvas.remove(obj))
    } else {
      canvas.remove(active)
    }
    canvas.discardActiveObject().requestRenderAll()
  }

  function hasSelection (): boolean {
    return Boolean(canvas?.getActiveObject())
  }

  /* ——— POLYGON VERTEX‑EDIT MODE ——— */
  function handleDblClick (e: fabric.IEvent): void {
    const tgt = e.target
    if (tgt?.type === 'polygon') toggleVertexEdit(tgt as fabric.Polygon)
  }

  function toggleVertexEdit (poly: fabric.Polygon): void {
    if (editingPolys.has(poly)) {
      // === turn OFF edit mode ===
      (poly as any).edit = false
      poly.controls = fabric.Polygon.prototype.controls
      poly.hasBorders = true
      editingPolys.delete(poly)
    } else {
      // === turn ON edit mode ===
      (poly as any).edit = true
      poly.hasBorders = false

      // one draggable Control per vertex
      poly.controls = poly.points!.reduce<Record<string, fabric.Control>>(
        (acc, _p, i): Record<string, fabric.Control> => {
          acc[`p${i}`] = new fabric.Control({
            positionHandler: fabric.Polygon.prototype.positionHandler,
            actionHandler: fabric.Polygon.prototype.actionHandler,
            actionName: 'modifyPolygon',
            pointIndex: i
          })
          return acc
        }, {})
      editingPolys.add(poly)
    }
    canvas.requestRenderAll()
  }

  /* ——— HELPERS ——— */
  function resizeCanvas (): void {
    const parent = canvasEl.value!.parentElement as HTMLElement
    canvas.setWidth(parent.clientWidth)
    canvas.setHeight(parent.clientHeight)
    canvas.requestRenderAll()
  }
  const rand = (min: number, max: number): number =>
    Math.random() * (max - min) + min
  const randomColor = (): string =>
    `hsl(${Math.random() * 360}, 65%, 70%)`

  /* ——— RETURN PUBLIC API ——— */
  return { canvasEl, addRect, addPolygon, deleteSelection, hasSelection }
}
