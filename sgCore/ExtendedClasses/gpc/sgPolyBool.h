#ifndef __sg_h
#define __sg_h

#include <stdio.h>

#define SG_EPSILON (DBL_EPSILON)

typedef enum                        /* Set operation type                */
{
  SG_DIFF,                         /* Difference                        */
  SG_INT,                          /* Intersection                      */
  SG_XOR,                          /* Exclusive or                      */
  SG_UNION                         /* Union                             */
} sg_op;

typedef struct                      /* Polygon vertex structure          */
{
  long double              x;            /* Vertex x component                */
  long double              y;            /* vertex y component                */
} sg_vertex;

typedef struct                      /* Vertex list structure             */
{
  int                 num_vertices; /* Number of vertices in list        */
  sg_vertex         *vertex;       /* Vertex array pointer              */
} sg_vertex_list;

typedef struct                      /* Polygon set structure             */
{
  int                 num_contours; /* Number of contours in polygon     */
  int                *hole;         /* Hole / external contour flags     */
  sg_vertex_list    *contour;      /* Contour array pointer             */
} sg_polygon;

typedef struct                      /* Tristrip set structure            */
{
  int                 num_strips;   /* Number of tristrips               */
  sg_vertex_list    *strip;        /* Tristrip array pointer            */
} sg_tristrip;


/*
===========================================================================
                       Public Function Prototypes
===========================================================================
*/

void sg_read_polygon        (FILE            *infile_ptr,
                              int              read_hole_flags,
                              sg_polygon     *polygon);

void sg_write_polygon       (FILE            *outfile_ptr,
                              int              write_hole_flags,
                              sg_polygon     *polygon);

void sg_add_contour         (sg_polygon     *polygon,
                              sg_vertex_list *contour,
                              int              hole);

void sg_polygon_clip        (sg_op           set_operation,
                              sg_polygon     *subject_polygon,
                              sg_polygon     *clip_polygon,
                              sg_polygon     *result_polygon);

void sg_tristrip_clip       (sg_op           set_operation,
                              sg_polygon     *subject_polygon,
                              sg_polygon     *clip_polygon,
                              sg_tristrip    *result_tristrip);

void sg_polygon_to_tristrip (sg_polygon     *polygon,
                              sg_tristrip    *tristrip);

void sg_free_polygon        (sg_polygon     *polygon);

void sg_free_tristrip       (sg_tristrip    *tristrip);

#endif

/*
===========================================================================
                           End of file: gpc.h
===========================================================================
*/
