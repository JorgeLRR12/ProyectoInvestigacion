import { ProfesorModel } from "../model/ProfesorModel.js";

$(document).ready(function () {
  const url = "https://paginas-web-cr.com/Api/apis/";
  const modalProfesor = new bootstrap.Modal(document.getElementById("modalProfesor"));
  const modalEliminar = new bootstrap.Modal(document.getElementById("modalEliminar"));

  let profesorIdEliminar = null;

  function cargarProfesores() {
    $.ajax({
      type: "POST",
      url: url + "ListaProfesores.php",
      dataType: "json",
      success: function (response) {
        const tbody = $("#tablaProfesores tbody").empty();
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
            $("#idProfesor").val(item.id);
            $("#nombre").val(item.nombre);
            $("#apellidopaterno").val(item.apellidopaterno);
            $("#apellidomaterno").val(item.apellidomaterno);
            $("#cedula").val(item.cedula);
            $("#correoelectronico").val(item.correoelectronico);
            $("#telefonocelular").val(item.telefonocelular);
            $("#nacionalidad").val(item.nacionalidad);
            modalProfesor.show();
          }));
          acciones.append($("<button>").addClass("btn btn-danger btn-sm").text("Eliminar").click(function () {
            profesorIdEliminar = item.id;
            modalEliminar.show();
          }));
          fila.append(acciones);
          tbody.append(fila);
        });
      }
    });
  }

  cargarProfesores();

  $("#btnNuevo").click(function () {
    $("#formProfesor")[0].reset();
    $("#idProfesor").val("");
    modalProfesor.show();
  });

  $("#formProfesor").submit(function (e) {
    e.preventDefault();
    const profesor = new ProfesorModel(
      $("#idProfesor").val() || null,
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
    const endpoint = profesor.id ? "ActualizarProfesores.php" : "InsertarProfesores.php";

    $.ajax({
      type: "POST",
      url: url + endpoint,
      data: JSON.stringify(profesor),
      contentType: "application/json",
      dataType: "json",
      success: function () {
        modalProfesor.hide();
        cargarProfesores();
      }
    });
  });

  $("#confirmEliminar").click(function () {
    if (profesorIdEliminar) {
      $.ajax({
        type: "POST",
        url: url + "BorrarProfesores.php",
        data: JSON.stringify({ id: profesorIdEliminar }),
        contentType: "application/json",
        dataType: "json",
        success: function () {
          modalEliminar.hide();
          cargarProfesores();
        }
      });
    }
  });
});
