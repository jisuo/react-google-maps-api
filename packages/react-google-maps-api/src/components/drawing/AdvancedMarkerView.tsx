import {
  memo,
  useRef,
  useMemo,
  Children,
  useState,
  useEffect,
  useContext,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type PropsWithChildren,
} from 'react'
import { createPortal } from 'react-dom'

import MapContext from '../../map-context'
import { HasAdvancedMarkerViewAnchor } from '../../types'
import type { Clusterer } from '@react-google-maps/marker-clusterer'
import type { MarkerClusterer as GoogleClusterer } from '@googlemaps/markerclusterer'

type AdvancedMarkerViewProps = PropsWithChildren<{
  /** Marker position. */
  position: google.maps.LatLng | google.maps.LatLngLiteral
  children?: ReactNode | undefined
  options?: google.maps.MarkerOptions | undefined
  draggable?: boolean | undefined
  collisionBehavior?: google.maps.CollisionBehavior | null
  /** Rollover text */
  title?: string | undefined
  /** All markers are displayed on the map in order of their zIndex, with higher values displaying in front of markers with lower values. By default, markers are displayed according to their vertical position on screen, with lower markers appearing in front of markers further up the screen. */
  zIndex?: number | undefined
  /** Render prop that handles clustering markers */
  clusterer?: Clusterer | GoogleClusterer | undefined
  /** Clusters are redrawn when a Marker is added unless noClustererRedraw? is set to true. */
  noClustererRedraw?: boolean | undefined
  /** This event is fired when the marker icon was clicked. */
  onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker icon was double clicked. */
  onDblClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is repeatedly fired while the user drags the marker. */
  onDrag?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user stops dragging the marker. */
  onDragEnd?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker's draggable property changes. */
  onDraggableChanged?: (() => void) | undefined
  /** This event is fired when the user starts dragging the marker. */
  onDragStart?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired for a mousedown on the marker. */
  onMouseDown?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the mouse leaves the area of the marker icon. */
  onMouseOut?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the mouse enters the area of the marker icon. */
  onMouseOver?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired for a mouseup on the marker. */
  onMouseUp?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker position property changes. */
  onPositionChanged?: (() => void) | undefined
  /** This event is fired for a rightclick on the marker. */
  onRightClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker title property changes. */
  onTitleChanged?: (() => void) | undefined
  /** This event is fired when the marker's zIndex property changes. */
  onZindexChanged?: (() => void) | undefined
  /** This callback is called when the marker instance has loaded. It is called with the marker instance. */
  onLoad?: ((marker: google.maps.marker.AdvancedMarkerView) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the marker instance. */
  onUnmount?:
    | ((marker: google.maps.marker.AdvancedMarkerView) => void)
    | undefined
}>

const defaultOptions = {}

function MarkerFunctional({
  children,
  position,
  options,
  clusterer,
  noClustererRedraw,
  draggable,
  title,
  zIndex,
  onClick,
  onDblClick,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onMouseDown,
  onRightClick,
  onDraggableChanged,
  onPositionChanged,
  onTitleChanged,
  onZindexChanged,
  onLoad,
  onUnmount,
}: AdvancedMarkerViewProps): JSX.Element | null {
  const map = useContext<google.maps.Map | null>(MapContext)
  const markerContentRef = useRef<HTMLDivElement | null>(null)

  const [instance, setInstance] =
    useState<google.maps.marker.AdvancedMarkerView | null>(null)

  const [dblclickListener, setDblclickListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [dragendListener, setDragendListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [dragstartListener, setDragstartListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [mousedownListener, setMousedownListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [mouseoutListener, setMouseoutListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [mouseoverListener, setMouseoverListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [mouseupListener, setMouseupListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [rightClickListener, setRightClickListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [clickListener, setClickListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [dragListener, setDragListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [draggableChangedListener, setDraggableChangedListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [positionChangedListener, setPositionChangedListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [titleChangedListener, setTitleChangedListener] =
    useState<google.maps.MapsEventListener | null>(null)
  const [zIndexChangedListener, setZindexChangedListener] =
    useState<google.maps.MapsEventListener | null>(null)

  useEffect(() => {
    if (instance !== null) {
      instance.map = map
    }
  }, [map, instance])

  useEffect(() => {
    if (typeof draggable !== 'undefined' && instance !== null) {
      instance.draggable = draggable
    }
  }, [instance, draggable])

  useEffect(() => {
    if (position && instance !== null) {
      instance.position = position
    }
  }, [instance, position])

  useEffect(() => {
    if (instance && onDblClick) {
      if (dblclickListener !== null) {
        google.maps.event.removeListener(dblclickListener)
      }

      setDblclickListener(
        google.maps.event.addListener(instance, 'dblclick', onDblClick)
      )
    }
  }, [onDblClick])

  useEffect(() => {
    if (instance && onDragEnd) {
      if (dragendListener !== null) {
        google.maps.event.removeListener(dragendListener)
      }

      setDragendListener(
        google.maps.event.addListener(instance, 'dragend', onDragEnd)
      )
    }
  }, [onDragEnd])

  useEffect(() => {
    if (instance && onDragStart) {
      if (dragstartListener !== null) {
        google.maps.event.removeListener(dragstartListener)
      }

      setDragstartListener(
        google.maps.event.addListener(instance, 'dragstart', onDragStart)
      )
    }
  }, [onDragStart])

  useEffect(() => {
    if (instance && onMouseDown) {
      if (mousedownListener !== null) {
        google.maps.event.removeListener(mousedownListener)
      }

      setMousedownListener(
        google.maps.event.addListener(instance, 'mousedown', onMouseDown)
      )
    }
  }, [onMouseDown])

  useEffect(() => {
    if (instance && onMouseOut) {
      if (mouseoutListener !== null) {
        google.maps.event.removeListener(mouseoutListener)
      }

      setMouseoutListener(
        google.maps.event.addListener(instance, 'mouseout', onMouseOut)
      )
    }
  }, [onMouseOut])

  useEffect(() => {
    if (instance && onMouseOver) {
      if (mouseoverListener !== null) {
        google.maps.event.removeListener(mouseoverListener)
      }

      setMouseoverListener(
        google.maps.event.addListener(instance, 'mouseover', onMouseOver)
      )
    }
  }, [onMouseOver])

  useEffect(() => {
    if (instance && onMouseUp) {
      if (mouseupListener !== null) {
        google.maps.event.removeListener(mouseupListener)
      }

      setMouseupListener(
        google.maps.event.addListener(instance, 'mouseup', onMouseUp)
      )
    }
  }, [onMouseUp])

  useEffect(() => {
    if (instance && onRightClick) {
      if (rightClickListener !== null) {
        google.maps.event.removeListener(rightClickListener)
      }

      setRightClickListener(
        google.maps.event.addListener(instance, 'rightclick', onRightClick)
      )
    }
  }, [onRightClick])

  useEffect(() => {
    if (instance && onClick) {
      if (clickListener !== null) {
        google.maps.event.removeListener(clickListener)
      }

      setClickListener(
        google.maps.event.addListener(instance, 'click', onClick)
      )
    }
  }, [onClick])

  useEffect(() => {
    if (instance && onDrag) {
      if (dragListener !== null) {
        google.maps.event.removeListener(dragListener)
      }

      setDragListener(google.maps.event.addListener(instance, 'drag', onDrag))
    }
  }, [onDrag])

  useEffect(() => {
    if (instance && onDraggableChanged) {
      if (draggableChangedListener !== null) {
        google.maps.event.removeListener(draggableChangedListener)
      }

      setDraggableChangedListener(
        google.maps.event.addListener(
          instance,
          'draggable_changed',
          onDraggableChanged
        )
      )
    }
  }, [onDraggableChanged])

  useEffect(() => {
    if (instance && onPositionChanged) {
      if (positionChangedListener !== null) {
        google.maps.event.removeListener(positionChangedListener)
      }

      setPositionChangedListener(
        google.maps.event.addListener(
          instance,
          'position_changed',
          onPositionChanged
        )
      )
    }
  }, [onPositionChanged])

  useEffect(() => {
    if (instance && onTitleChanged) {
      if (titleChangedListener !== null) {
        google.maps.event.removeListener(titleChangedListener)
      }

      setTitleChangedListener(
        google.maps.event.addListener(instance, 'title_changed', onTitleChanged)
      )
    }
  }, [onTitleChanged])

  useEffect(() => {
    if (instance && onZindexChanged) {
      if (zIndexChangedListener !== null) {
        google.maps.event.removeListener(zIndexChangedListener)
      }

      setZindexChangedListener(
        google.maps.event.addListener(
          instance,
          'zindex_changed',
          onZindexChanged
        )
      )
    }
  }, [onZindexChanged])

  useEffect(() => {
    markerContentRef.current = document.createElement('div')

    const markerOptions = {
      ...(options || defaultOptions),
      ...(clusterer ? defaultOptions : { map }),
      position: position,
      content: markerContentRef.current,
    }

    const marker = new google.maps.marker.AdvancedMarkerView(markerOptions)

    if (clusterer) {
      clusterer.addMarker(marker as google.maps.Marker, !!noClustererRedraw)
    } else {
      marker.map = map
    }

    if (position) {
      marker.position = position
    }

    if (typeof draggable !== 'undefined') {
      marker.draggable = draggable
    }

    if (typeof title === 'string') {
      marker.title = title
    }

    if (typeof zIndex === 'number') {
      marker.zIndex = zIndex
    }

    if (onDblClick) {
      setDblclickListener(marker.addListener('dblclick', onDblClick))
    }

    if (onDragEnd) {
      setDragendListener(marker.addListener('dragend', onDragEnd))
    }

    if (onDragStart) {
      setDragstartListener(marker.addListener('dragstart', onDragStart))
    }

    if (onMouseDown) {
      setMousedownListener(marker.addListener('mousedown', onMouseDown))
    }

    if (onMouseOut) {
      setMouseoutListener(marker.addListener('mouseout', onMouseOut))
    }

    if (onMouseOver) {
      setMouseoverListener(marker.addListener('mouseover', onMouseOver))
    }

    if (onMouseUp) {
      setMouseupListener(marker.addListener('mouseup', onMouseUp))
    }

    if (onRightClick) {
      setRightClickListener(marker.addListener('rightclick', onRightClick))
    }

    if (onClick) {
      setClickListener(marker.addListener('click', onClick))
    }

    if (onDrag) {
      setDragListener(marker.addListener('drag', onDrag))
    }

    if (onDraggableChanged) {
      setDraggableChangedListener(
        marker.addListener('draggable_changed', onDraggableChanged)
      )
    }

    if (onPositionChanged) {
      setPositionChangedListener(
        marker.addListener('position_changed', onPositionChanged)
      )
    }

    if (onTitleChanged) {
      setTitleChangedListener(
        marker.addListener('title_changed', onTitleChanged)
      )
    }

    if (onZindexChanged) {
      setZindexChangedListener(
        marker.addListener('zindex_changed', onZindexChanged)
      )
    }

    setInstance(marker)

    if (onLoad) {
      onLoad(marker)
    }

    return () => {
      if (dblclickListener !== null) {
        google.maps.event.removeListener(dblclickListener)
      }

      if (dragendListener !== null) {
        google.maps.event.removeListener(dragendListener)
      }

      if (dragstartListener !== null) {
        google.maps.event.removeListener(dragstartListener)
      }

      if (mousedownListener !== null) {
        google.maps.event.removeListener(mousedownListener)
      }

      if (mouseoutListener !== null) {
        google.maps.event.removeListener(mouseoutListener)
      }

      if (mouseoverListener !== null) {
        google.maps.event.removeListener(mouseoverListener)
      }

      if (mouseupListener !== null) {
        google.maps.event.removeListener(mouseupListener)
      }

      if (rightClickListener !== null) {
        google.maps.event.removeListener(rightClickListener)
      }

      if (clickListener !== null) {
        google.maps.event.removeListener(clickListener)
      }

      if (draggableChangedListener !== null) {
        google.maps.event.removeListener(draggableChangedListener)
      }

      if (positionChangedListener !== null) {
        google.maps.event.removeListener(positionChangedListener)
      }

      if (titleChangedListener !== null) {
        google.maps.event.removeListener(titleChangedListener)
      }

      if (zIndexChangedListener !== null) {
        google.maps.event.removeListener(zIndexChangedListener)
      }

      if (onUnmount) {
        onUnmount(marker)
      }

      if (clusterer) {
        clusterer.removeMarker(
          marker as google.maps.Marker,
          !!noClustererRedraw
        )
      } else if (marker) {
        marker.map = null
      }
    }
  }, [])

  const advancedMarkerView = useMemo<ReactNode | null>(() => {
    return children && markerContentRef.current
      ? createPortal(
          Children.map(children, (child) => {
            if (!isValidElement<HasAdvancedMarkerViewAnchor>(child)) {
              return child
            }
            const elementChild: ReactElement<HasAdvancedMarkerViewAnchor> =
              child
            return cloneElement(elementChild, { anchor: instance })
          }),
          markerContentRef.current
        )
      : null
  }, [children, instance])

  return <>{advancedMarkerView}</> || null
}

export const AdvancedMarkerView = memo(MarkerFunctional)
