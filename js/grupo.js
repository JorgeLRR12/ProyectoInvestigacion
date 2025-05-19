import { GrupoModel } from "../model/GrupoModel.js";

$(document).ready(function () {
  const url = "https://paginas-web-cr.com/Api/apis/";
  const modalGrupo = new bootstrap.Modal(document.getElementById("modalGrupo"));
  const modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

  let grupoIdEliminar = null;

  function cargarGrupos() {
    $.ajax({
      type: "POST",
      url: url + "ListaGrupo.php",
      dataType: "json",
      success: function (response) {
        const tbody = $("#tablaGrupos tbody").empty();
        $.each(response.data, function (i, item) {
          const fila = $("<tr>");
          fila.append($("<td>").text(item.id));
          fila.append($("<td>").text(item.nombre));
          const acciones = $("<td>");
          acciones.append($("<button>").addClass("btn btn-warning btn-sm me-2").text("Editar").click(function () {
            $("#idGrupo").val(item.id);
            $("#nombre").val(item.nombre);
            modalGrupo.show();
          }));
          acciones.append($("<button>").addClass("btn btn-danger btn-sm").text("Eliminar").click(function () {
            grupoIdEliminar = item.id;
            modalEliminar.show();
          }));
          fila.append(acciones);
          tbody.append(fila);
        });
      }
    });
  }

  cargarGrupos();

  $("#btnNuevo").click(function () {
    $("#formGrupo")[0].reset();
    $("#idGrupo").val("");
    modalGrupo.show();
  });

  $("#formGrupo").submit(function (e) {
    e.preventDefault();
    const grupo = new GrupoModel(
      $("#idGrupo").val() || null,
      $("#nombre").val()
    );
    const endpoint = grupo.id ? "ActualizarGrupo.php" : "InsertarGrupo.php";

    $.ajax({
      type: "POST",
      url: url + endpoint,
      data: JSON.stringify(grupo),
      contentType: "application/json",
      dataType: "json",
      success: function () {
        modalGrupo.hide();
        cargarGrupos();
      }
    });
  });

  $("#confirmEliminar").click(function () {
    if (grupoIdEliminar) {
      $.ajax({
        type: "POST",
        url: url + "BorrarGrupo.php",
        data: JSON.stringify({ id: grupoIdEliminar }),
        contentType: "application/json",
        dataType: "json",
        success: function () {
          modalEliminar.hide();
          cargarGrupos();
        }
      });
    }
  });
});
