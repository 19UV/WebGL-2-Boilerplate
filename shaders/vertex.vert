#version 300 es

in vec4 a_position;

out vec2 tex_coord;

void main() {
    tex_coord = a_position.xy;
    gl_Position = a_position;
}