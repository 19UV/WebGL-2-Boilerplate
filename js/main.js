var c, gl;
var fragSource, vertSource;
var program, vertexShader, fragmentShader;
var canvas_dim = [];

function load() {
    var to_load = 2;
    
    var frag = new XMLHttpRequest();
    frag.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && this.responseText != "") {
            fragSource = this.responseText.trim();
            to_load--;
            if (to_load == 0) {init()}
        }
    };
    frag.open("GET", "shaders/fragment.frag", true);
    frag.send();
    
    var vert = new XMLHttpRequest();
    vert.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && this.responseText != "") {
            vertSource = this.responseText.trim();
            to_load--;
            if (to_load == 0) {init()}
        }
    };
    vert.open("GET", "shaders/vertex.vert", true);
    vert.send();
}

function init() {
    c = document.getElementById('canvas');
    gl = c.getContext('webgl2');
    
    document.addEventListener('resize', onResize);
    onResize();
    
    if (!gl) {
        alert('WEBGL 2 not supported!');
    }
    
    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertSource);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragSource);
    
    program = createProgram(gl, vertexShader, fragmentShader);
    
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    
    var positionBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    
    var positions = [
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0
        ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(program);
    
    gl.bindVertexArray(vao);
    
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function onResize() {
    canvas_dim = [window.innerWidth, window.innerHeight]
    c.height = canvas_dim[0];
    c.width = canvas_dim[1];
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}