package com.lavoztica.api.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import oracle.jdbc.OracleTypes;

import java.sql.ResultSet;
import java.util.*;

@Repository
public class NoticiasDao {
  private final JdbcTemplate jdbc;
  public NoticiasDao(JdbcTemplate jdbc){ this.jdbc = jdbc; }

  // Llama a SP_LISTAR_ULTIMAS_NOTICIAS
  public List<Map<String,Object>> listarUltimas(Integer idTema, int max) {
    SimpleJdbcCall call = new SimpleJdbcCall(jdbc)
      .withProcedureName("SP_LISTAR_ULTIMAS_NOTICIAS")
      .declareParameters(
        new SqlParameter("p_id_tema", java.sql.Types.NUMERIC),
        new SqlParameter("p_max", java.sql.Types.NUMERIC),
        new SqlOutParameter("p_cursor", OracleTypes.CURSOR, (ResultSet rs, int rn)->{
          Map<String,Object> m = new LinkedHashMap<>();
          m.put("idNoticia", rs.getInt("ID_NOTICIA"));
          m.put("titulo", rs.getString("TITULO"));
          m.put("fechaPublicacion", rs.getTimestamp("FECHA_PUBLICACION"));
          m.put("visitas", rs.getInt("VISITAS"));
          m.put("promedio", rs.getBigDecimal("PROMEDIO_CALIFICACION"));
          return m;
        })
      );

    Map<String,Object> out = call.execute(
      new MapSqlParameterSource()
        .addValue("p_id_tema", idTema)
        .addValue("p_max", max)
    );
    @SuppressWarnings("unchecked")
    List<Map<String,Object>> lista = (List<Map<String,Object>>) out.get("p_cursor");
    return lista != null ? lista : Collections.emptyList();
  }
}
