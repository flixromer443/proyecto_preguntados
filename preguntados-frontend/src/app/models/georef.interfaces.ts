//Provincias
export interface Provincia {
  id: string;
  nombre: string;
  centroide_lat: number;
  centroide_lon: number;
}

export interface ProvinciasResponse {
  cantidad: number;
  inicio: number;
  total: number;
  provincias: Provincia[];
}


//Departamentos
export interface Departamento {
  id: string;
  nombre: string;
  provincia_id: string;
  provincia_nombre: string;
  centroide_lat: number;
  centroide_lon: number;
}

export interface DepartamentosResponse {
  cantidad: number;
  inicio: number;
  total: number;
  departamentos: Departamento[];
}

//Localidades
export interface Localidad {
  id: string;
  nombre: string;

  categoria: string;

  provincia_id: string;
  provincia_nombre: string;

  departamento_id: string;
  departamento_nombre: string;

  centroide_lat: number;
  centroide_lon: number;

  // opcionales pero útiles
  gobierno_local_id?: string;
  gobierno_local_nombre?: string;

  localidad_censal_id?: string;
  localidad_censal_nombre?: string;
}

export interface LocalidadesResponse {
  cantidad: number;
  inicio: number;
  total: number;
  localidades: Localidad[];
}