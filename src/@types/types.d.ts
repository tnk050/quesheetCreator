type CoursePoint = {
  _e: number;
  c?: boolean;
  d: number;
  i: number;
  n: string;
  t: string;
  x: number;
  y: number;
  description?: string;
};

type Intermediate = {
  type: string;
  notes: string;
  distance: number;
  description: string;
};

type QueSheetContents = {
  no: number;
  shape: string;
  point: string;
  direction: string;
  routeNumber: string;
  distance: number;
  remarks: string;
  notes: string;
};

type Response = {
  name: string;
  data: Blob;
};
