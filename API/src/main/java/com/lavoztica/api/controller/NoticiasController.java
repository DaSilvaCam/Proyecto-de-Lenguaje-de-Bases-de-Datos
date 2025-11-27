package com.lavoztica.api.controller;

import com.lavoztica.api.service.NoticiasService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class NoticiasController {

  private final NoticiasService service;
  public NoticiasController(NoticiasService service){ this.service = service; }

  @GetMapping("/noticias/ultimas")
  public List<Map<String,Object>> ultimas(
      @RequestParam(required=false) Integer idTema,
      @RequestParam(defaultValue="10") int max) {
    return service.ultimas(idTema, max);
  }
}
