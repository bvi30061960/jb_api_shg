#ifndef SGCORE_NATIVE_LIB_H
#define SGCORE_NATIVE_LIB_H

#if defined _WIN32 || defined _WIN64
      #define SGExport __declspec(dllexport)
#elif defined __linux__
      #define SGExport __attribute__((visibility("default")))
#else
      #define SGExport
#endif

#define   PTRTYPE     void*
#define   FLOATPTR    void*    
#define   ARRPTR      void*    


extern "C"
{
    SGExport void        sg_core_start();
    SGExport void        sg_core_stop();

    SGExport void        sg_object_free(PTRTYPE objPtr);
    SGExport void        sg_object_bounds(PTRTYPE objPtr, float& minX,float& minY,float& minZ,float& maxX,float& maxY,float& maxZ);

    SGExport PTRTYPE     sg_object_box(float szX, float szY, float szZ);
    SGExport PTRTYPE     sg_object_sphere(float rad, int uSeg, int vSeg);
	SGExport PTRTYPE     sg_object_cylinder(float rad, float heig, int uSeg);
	SGExport PTRTYPE     sg_object_cone(float r1, float r2, float heig, int uSeg);
	SGExport PTRTYPE     sg_object_torus(float r1, float r2, int uSeg, int vSeg);
	SGExport PTRTYPE     sg_object_custom_mesh(ARRPTR pnts, ARRPTR indxs);

	SGExport PTRTYPE     sg_object_line(float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z);
	SGExport PTRTYPE     sg_object_spline(ARRPTR pnts, int isClose);
	SGExport PTRTYPE     sg_object_circle_three_points(float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float p3_x, float p3_y, float p3_z);
	SGExport PTRTYPE     sg_object_circle_center_radius_normal(float c_x, float c_y, float c_z, float radius, float n_x, float n_y, float n_z);
	SGExport PTRTYPE     sg_object_arc_three_points(float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float p3_x, float p3_y, float p3_z, int invert);
	SGExport PTRTYPE     sg_object_arc_center_begin_end(float c_x, float c_y, float c_z, float b_x, float b_y, float b_z, float e_x, float e_y, float e_z, int invert);
	SGExport PTRTYPE     sg_object_arc_begin_end_normal_radius(float b_x, float b_y, float b_z, float e_x, float e_y, float e_z, float n_x, float n_y, float n_z, float radius, int invert);
	SGExport PTRTYPE     sg_object_arc_center_begin_normal_angle(float c_x, float c_y, float c_z, float b_x, float b_y, float b_z, float n_x, float n_y, float n_z, float angle);
	SGExport PTRTYPE     sg_object_arc_begin_end_normal_angle(float b_x, float b_y, float b_z, float e_x, float e_y, float e_z, float n_x, float n_y, float n_z, float angle);
   SGExport PTRTYPE     sg_object_path(ARRPTR subObjects);

    SGExport void        sg_object_move(PTRTYPE objPtr, float vecX, float vecY, float vecZ);
	SGExport void        sg_object_rotate(PTRTYPE objPtr, float pX, float pY, float pZ, float vecX, float vecY, float vecZ, float angleRad);
	SGExport void        sg_object_scale(PTRTYPE objPtr, float scX, float scY, float scZ);
    SGExport void        sg_object_transform(PTRTYPE objPtr, float* matr);

   SGExport PTRTYPE     sg_bool_sub(PTRTYPE objAPtr, PTRTYPE objBPtr);
	SGExport PTRTYPE     sg_bool_union(PTRTYPE objAPtr, PTRTYPE objBPtr);
	SGExport PTRTYPE     sg_bool_intersect(PTRTYPE objAPtr, PTRTYPE objBPtr);

	SGExport PTRTYPE     sg_kinematic_rotation(PTRTYPE profileObj, float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float angl_degree, int isClose, int segm);
	SGExport PTRTYPE     sg_kinematic_extrude(PTRTYPE profileObj, ARRPTR holesArr, float v_x, float v_y, float v_z, int isClose);
	SGExport PTRTYPE     sg_kinematic_spiral(PTRTYPE profileObj, ARRPTR holesArr, float p1_x, float p1_y, float p1_z, float p2_x, float p2_y, float p2_z, float screw_step, float screw_h, int  segm, int isClose);
	SGExport PTRTYPE     sg_kinematic_pipe(PTRTYPE profileObj, ARRPTR holesArr, PTRTYPE guideObj, float p1_x, float p1_y, float p1_z, float angle_around_point, int isClose);

	SGExport PTRTYPE     sg_surfaces_face(PTRTYPE outCont, ARRPTR holesArr);
	SGExport PTRTYPE     sg_surfaces_coons(PTRTYPE side1, PTRTYPE side2, PTRTYPE side3, PTRTYPE side4, int  segm1, int  segm2, int  segm3, int  segm4);
	SGExport PTRTYPE     sg_surfaces_mesh(int dim1, int dim2, ARRPTR pntsArr);
	SGExport PTRTYPE     sg_surfaces_sew(ARRPTR objsArr);
	SGExport PTRTYPE     sg_surfaces_linear(PTRTYPE side1, PTRTYPE side2, float firstparam, int isClose);

	SGExport int        sg_object_type(PTRTYPE objPtr);
	SGExport int        sg_group_child_count(PTRTYPE objPtr);
	SGExport PTRTYPE    sg_group_child(PTRTYPE objPtr, int chIndex);
	SGExport void       sg_group_break(PTRTYPE objPtr);

	SGExport int        sg_mesh_triangles_count(PTRTYPE objPtr);
	SGExport FLOATPTR   sg_mesh_matrix(PTRTYPE objPtr);
	SGExport FLOATPTR   sg_mesh_v(PTRTYPE objPtr);
	SGExport FLOATPTR   sg_mesh_n(PTRTYPE objPtr);
	SGExport FLOATPTR   sg_mesh_uv(PTRTYPE objPtr);

	SGExport ARRPTR     sg_array_create_int();
	SGExport void       sg_array_add_int(ARRPTR arrp, int val);
	SGExport void       sg_array_free_int(ARRPTR arrp);

	SGExport ARRPTR     sg_array_create_points();
	SGExport void       sg_array_add_point(ARRPTR arrp, float pX, float pY, float pZ);
	SGExport void       sg_array_free_points(ARRPTR arrp);

	SGExport ARRPTR     sg_array_create_objects();
	SGExport void       sg_array_add_object(ARRPTR arrp, PTRTYPE objP);
	SGExport void       sg_array_free_objects(ARRPTR arrp);
}

#endif
