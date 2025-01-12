export interface HasMarkerAnchor {
  anchor?: google.maps.Marker | null | undefined
}

export interface HasAdvancedMarkerViewAnchor {
  anchor?: google.maps.marker.AdvancedMarkerView | null | undefined
}

export interface PositionDrawProps {
  left?: string | number | undefined
  top?: string | number | undefined
  width?: string | number | undefined
  height?: string | number | undefined
}
