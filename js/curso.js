import { CursoModel } from "../model/CursoModel.js";

$(document).ready(function () {
  const url = "https://paginas-web-cr.com/Api/apis/";
  const modalCurso = new bootstrap.Modal(document.getElementById("modalCurso"));
  const modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

  let cursoIdEliminar = null;

  function cargarCursos() {
    $.ajax({
      type: "POST",
      url: url + "ListaCurso.php",
      dataType: "json",
      success: function (response) {
        const tbody = $("#tablaCursos tbody").empty();
        $.each(response.data, function (i, item) {
          const fila = $("<tr>");
          fila.append($("<td>").text(item.id));
          fila.append($("<td>").text(item.nombre));
          fila.append($("<td>").text(item.descripcion));
          fila.append($("<td>").text(item.tiempo));
          fila.append($("<td>").text(item.usuario));
          const acciones = $("<td>");
          acciones.append($("<button>").addClass("btn btn-warning btn-sm me-2").text("Editar").click(function () {
            $("#idCurso").val(item.id);
            $("#nombre").val(item.nombre);
            $("#descripcion").val(item.descripcion);
            $("#tiempo").val(item.tiempo);
            $("#usuario").val(item.usuario);
            modalCurso.show();
          }));
          acciones.append($("<button>").addClass("btn btn-danger btn-sm").text("Eliminar").click(function () {
            cursoIdEliminar = item.id;
            modalEliminar.show();
          }));
          fila.append(acciones);
          tbody.append(fila);
        });
      }
    });
  }

  cargarCursos();

  $("#btnNuevo").click(function () {
    $("#formCurso")[0].reset();
    $("#idCurso").val("");
    modalCurso.show();
  });

  $("#formCurso").submit(function (e) {
    e.preventDefault();
    const curso = new CursoModel(
      $("#idCurso").val() || null,
      $("#nombre").val(),
      $("#descripcion").val(),
      $("#tiempo").val(),
      $("#usuario").val()
    );
    const endpoint = curso.id ? "ActualizarCursos.php" : "InsertarCursos.php";

    $.ajax({
      type: "POST",
      url: url + endpoint,
      data: JSON.stringify(curso),
      contentType: "application/json",
      dataType: "json",
      success: function () {
        modalCurso.hide();
        cargarCursos();
      }
    });
  });

  $("#confirmEliminar").click(function () {
    if (cursoIdEliminar) {
      $.ajax({
        type: "POST",
        url: url + "BorrarCursos.php",
        data: JSON.stringify({ id: cursoIdEliminar }),
        contentType: "application/json",
        dataType: "json",
        success: function () {
          modalEliminar.hide();
          cargarCursos();
        }
      });
    }
  });
});
