package com.lavoztica.api.service;

import com.lavoztica.api.dao.NoticiasDao;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class NoticiasService {
  private final NoticiasDao dao;
  public NoticiasService(NoticiasDao dao){ this.dao = dao; }

  public List<Map<String,Object>> ultimas(Integer idTema, int max){
    return dao.listarUltimas(idTema, max);
  }
}
