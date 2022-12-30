export interface Pedidos {
  c_codigo_pdo: string;
  c_codigo_tem: string;
  v_nombre_tem: string;
  c_codigo_emp: string;
  v_nombre_pem: string;
  c_codigo_dis: string;
  v_nombre_dis: string;
  d_fecha_pdo: Date;
  c_estatus_pdo: string;
  d_fechaSalida_pdo: Date;
  v_observaciones_pdo: string;
  n_cajaspedidas_pdd: number;
  n_cajasempacadas_pdd: number;
  n_palets_pdd: number;
}

export interface Pedidosdet {
  c_codigo_pdo: string;
  c_codigo_tem: string;
  v_nombre_tem: string;
  c_codigo_emp: string;
  v_nombre_pem: string;
  c_codigo_dis: string;
  v_nombre_dis: string;
  d_fecha_pdo: Date;
  c_estatus_pdo: string;
  d_fechaSalida_pdo: Date;
  v_observaciones_pdo: string;
  c_codigo_pro: string;
  v_nombre_pro: string;
  c_codigo_eti: string;
  v_nombre_eti: string;
  c_codigo_col: string;
  v_nombre_col: string;
  n_cajaspedidas_pdd: number;
  n_cajasempacadas_pdd: number;
  n_palets_pdd: number;
  n_pallets_emp: number;
}

export interface Pellet {
  c_codigo_tem: string;
  c_codigo_emp: string;
  c_codigo_pal: string;
  c_codsec_pal: string;
  c_codigo_pdo: string;
  c_codigo_est: string;
  c_tipo_pal: string;
  c_codigo_pro: string;
  c_codigo_eti: string;
  c_codigo_col: string;
  n_bulxpa_pal: number;
  n_peso_pal: number;
}

export interface Palletpedido {
  c_codigo_tem: string;
  c_codigo_emp: string;
  c_codigo_pdo: string;
  c_codigo_pal: string;
  c_codigo_pro: string;
  v_nombre_pro: string;
  c_codigo_eti: string;
  v_nombre_eti: string;
  c_codigo_col: string;
  v_nombre_col: string;
  n_bulxpa_pal: number;
  n_peso_pal: number;
}

export interface Empresas {
  C_codigo_emp: string;
  V_nombre_emp: string;
}

export interface Areas {
  c_codigo_are: string;
  v_nombre_are: string;
}

export interface Cajas {
  c_codigo_tcj: string;
  v_nombre_tcj: string;
}

export interface OpcionesMenu {
  c_codigo_sme: string;
  v_nombre_sme: string;
  v_imagetile: string;
  v_nombreclase_sme: string;
}

export interface Lotes {
  c_codigo_rec: string;
  c_concecutivo_dso: string;
  c_codigo_lot: string;
  n_kilos_dso: number;
  c_codigo_pal: string;
}

export interface Grado {
  c_codigo_gdm: string;
  v_nombre_gdm: string;
}

export interface Bandas {
  c_codigo_bnd: string;
  v_nombre_bnd: string;
  c_codigo_cul: string;
  v_nombre_cul: string;
  c_codigo_lot: string;
  v_nombre_lot: string;
  n_superf_lot: number;
  c_codigo_sel: string;
  c_codigo_prq: string;
  c_horaFin_prq: string;
  c_horaIni_prq: string;
  d_fechaIni_prq: Date;
  d_fechaFin_prq: Date;
  c_corriendo_prq: string;
  KilosRec: number;
  KilosEmp: number;
  d_fecha_sel: Date;
}

export interface Temporadas {
  c_codigo_tem: string;
  v_nombre_tem: string;
  d_inicio_tem: Date;
  d_fin_tem: Date;
}

export interface CajaConteo {
  c_terminal_ccp: string;
  c_codigo_emp: string;
  c_idcaja_ccp: string;
  c_empleado_ccp: string;
  d_fecha_ccp: Date;
  c_hrconteo_ccp: string;
  n_bulxpa_ccp: string;
  c_codigo_usu: string;
}

export interface PuntoEmpaque {
  c_codigo_pem: string;
  v_nombre_pem: string;
  v_codigoaux_pem: String;
}
