export class EyePalletVirtual {
  c_codigo_tem: string;
  c_codigo_emp: string;
  c_codigo: string;
  c_codigo_pal: string;
  c_codsec_pal: string;
  c_tipo_pal: string;
  d_empaque_pal: Date;
  c_hora_pal: string;
  c_codigo_sel: string;
  c_codigo_bnd: string;
  c_codigo_lot: string;
  v_nombre_lot: string;
  c_codigo_cul: string;
  v_nombre_cul: string;
  c_codigo_pro: string;
  v_nombre_pro: string;
  c_codigo_eti: string;
  v_nombre_eti: string;
  c_codigo_col: string;
  v_nombre_col: string;
  c_codigo_env: string;
  v_nombre_env: string;
  v_nombre_tam: string;
  n_bulxpa_pal: number;
  n_peso_pme: number;
  c_codigo_usu: string;
  d_creacion: Date;
  c_usumod: string;
  d_modifi: Date;
  c_activo: string;
  n_totalbulxpa_pme: number;
  n_totalpeso_pme: number;

  constructor() {
    this.c_codigo_tem ='' ,
    this.c_codigo_emp ='' ,
    this.c_codigo ='' ,
    this.c_codigo_pal ='' ,
    this.c_codsec_pal ='' ,
    this.c_tipo_pal ='' ,
    this.d_empaque_pal= null ;
    this.c_hora_pal ='' ,
    this.c_codigo_sel ='' ,
    this.c_codigo_bnd ='' ,
    this.c_codigo_lot ='' ,
    this.v_nombre_lot ='' ,
    this.c_codigo_cul ='' ,
    this.v_nombre_cul ='' ,
    this.c_codigo_pro ='' ,
    this.v_nombre_pro ='' ,
    this.c_codigo_eti ='' ,
    this.v_nombre_eti ='' ,
    this.c_codigo_col ='' ,
    this.v_nombre_col ='' ,
    this.c_codigo_env ='' ,
    this.v_nombre_env ='' ,
    this.v_nombre_tam ='' ,
    this.n_bulxpa_pal =0 ,
    this.n_peso_pme=0 ,
    this.c_codigo_usu ='' ,
    this.d_creacion = null,
    this.c_usumod ='' ,
    this.d_modifi =null ,
    this.c_activo ='' ,
    this.n_totalbulxpa_pme =0 ,
    this.n_totalpeso_pme  =0 
  }
}
