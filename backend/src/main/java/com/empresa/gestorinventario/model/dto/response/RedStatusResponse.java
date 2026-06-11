package com.empresa.gestorinventario.model.dto.response;

import java.util.List;

public record RedStatusResponse(
    boolean modoRed,
    List<String> ipsLocales,
    int puerto
) {}
