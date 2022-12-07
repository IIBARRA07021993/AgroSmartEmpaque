

export interface Componentes {
   icon: string,
   name: string,
   url: string

}



export interface Pedidos {
   $id: string;
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
   $id: string;
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
   $id: string;
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
