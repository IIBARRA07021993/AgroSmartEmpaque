export class NomEmpleado {
  c_codigo_emp: string;
  v_nombre_emp: string;
  c_sexo_emp: string;
  v_rfc_emp: string;
  v_curp_emp: string;
  n_sueldo_emp: number;
  n_sdoimss_emp: number;
  n_sueldofiscal_emp: number;
  c_numimss_emp: string;
  v_telefono_emp: string;
  v_telefono_accidente: string;

  constructor() {
    this.c_codigo_emp = '';
    this.v_nombre_emp = '';
    this.c_sexo_emp = '';
    this.v_rfc_emp = '';
    this.v_curp_emp = '';
    this.n_sueldo_emp = 0;
    this.n_sdoimss_emp = 0;
    this.n_sueldofiscal_emp = 0;
    this.c_numimss_emp = '';
    this.v_telefono_emp = '';
    this.v_telefono_accidente = '';
  }
}
