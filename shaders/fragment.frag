#version 300 es
 
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;

in vec2 tex_coord;
out vec4 outColor;

void main() {
    vec2 uv = (tex_coord+1.0)/2.0;
    vec3 col = vec3(uv, 1.0);
    outColor = vec4(col, 1.0);
}