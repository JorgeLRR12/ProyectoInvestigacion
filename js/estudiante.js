import { EstudianteModel } from "../model/EstudianteModel.js";

$(document).ready(function () {
  const url = "https://paginas-web-cr.com/Api/apis/";
  const modalEstudiante = new bootstrap.Modal(document.getElementById("modalEstudiante"));
  const modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

  let estudianteIdEliminar = null;

  function cargarEstudiantes() {
    $.ajax({
      type: "POST",
      url: url + "ListaEstudiantes.php",
      dataType: "json",
      success: function (response) {
        const tbody = $("#tablaEstudiantes tbody").empty();
        $.each(response.data, function (i, item) {
          const fila = $("<tr>");
          fila.append($("<td>").text(item.id));
          fila.append($("<td>").text(item.nombre + " " + item.apellidopaterno + " " + item.apellidomaterno));
          fila.append($("<td>").text(item.cedula));
          fila.append($("<td>").text(item.correoelectronico));
          fila.append($("<td>").text(item.telefonocelular));
          fila.append($("<td>").text(item.nacionalidad));
          const acciones = $("<td>");
          acciones.append($("<button>").addClass("btn btn-warning btn-sm me-2").text("Editar").click(function () {
            $("#idEstudiante").val(item.id);
            $("#nombre").val(item.nombre);
            $("#apellidopaterno").val(item.apellidopaterno);
            $("#apellidomaterno").val(item.apellidomaterno);
            $("#cedula").val(item.cedula);
            $("#correoelectronico").val(item.correoelectronico);
            $("#telefonocelular").val(item.telefonocelular);
            $("#nacionalidad").val(item.nacionalidad);
            modalEstudiante.show();
          }));
          acciones.append($("<button>").addClass("btn btn-danger btn-sm").text("Eliminar").click(function () {
            estudianteIdEliminar = item.id;
            modalEliminar.show();
          }));
          fila.append(acciones);
          tbody.append(fila);
        });
      }
    });
  }

  cargarEstudiantes();

  $("#btnNuevo").click(function () {
    $("#formEstudiante")[0].reset();
    $("#idEstudiante").val("");
    modalEstudiante.show();
  });

  $("#formEstudiante").submit(function (e) {
    e.preventDefault();
    const estudiante = new EstudianteModel(
      $("#idEstudiante").val() || null,
      $("#cedula").val(),
      $("#correoelectronico").val(),
      "00000000",
      $("#telefonocelular").val(),
      "2000-01-01",
      "M",
      "Desconocida",
      $("#nombre").val(),
      $("#apellidopaterno").val(),
      $("#apellidomaterno").val(),
      $("#nacionalidad").val(),
      "1",
      $("#nombre").val()
    );
    const endpoint = estudiante.id ? "ActualizarEstudiantes.php" : "InsertarEstudiantes.php";

    $.ajax({
      type: "POST",
      url: url + endpoint,
      data: JSON.stringify(estudiante),
      contentType: "application/json",
      dataType: "json",
      success: function () {
        modalEstudiante.hide();
        cargarEstudiantes();
      }
    });
  });

  $("#confirmEliminar").click(function () {
    if (estudianteIdEliminar) {
      $.ajax({
        type: "POST",
        url: url + "BorrarEstudiantes.php",
        data: JSON.stringify({ id: estudianteIdEliminar }),
        contentType: "application/json",
        dataType: "json",
        success: function () {
          modalEliminar.hide();
          cargarEstudiantes();
        }
      });
    }
  });
});
