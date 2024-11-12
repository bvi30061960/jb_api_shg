using sgCoreWrapper;
using sgCoreWrapper.Objects;
using sgCoreWrapper.Helpers;
using sgCoreWrapper.Interfaces;
using sgCoreWrapper.Structs;

using Newtonsoft.Json;
using System.Diagnostics.Contracts;


using System.IO;


using System.Collections;
using System.Drawing;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace jb_api_shg.AppCode
{


    //namespace TestExampleSgCore
    //{


    //****************************************************************************************************

    public enum enum_model_side
    {
        up_side,
        lateral_side
    }

    public class typ_sides_data
    {
        public typ_color_data ColorParts { set; get; }

        public typ_side_data data1 { set; get; }
        public typ_side_data data2 { set; get; }

    };


    public class typ_color_data
    {
        public string[][] ColorParts { set; get; }
    }


    public class typ_parameters
    {
        //public bool is_space_adjust { get; set; }
        //public bool is_curve_width_adjust { get; set; }
        //public decimal distance_bt_curves { get; set; }
        //public decimal distance_bt_curves_in_percent { get; set; }
        //public decimal shape_height { get; set; }
        //public decimal shape_width { get; set; }

        public decimal container_width { get; set; }
        public decimal container_height { get; set; }
        public decimal shape_width_beg { get; set; }
        public decimal shape_width { get; set; }
        public decimal shape_height_beg { get; set; }
        public decimal shape_height { get; set; }
        public int shape_amount_curves { get; set; }
        public int spline_amount_segments { get; set; }
        public bool ajust_curves_by_shape { get; set; }
        public bool ajust_shape_by_curves { get; set; }
        public decimal distance_between_curves_in_percent_of_width { get; set; }
        public decimal distance_bt_curves { get; set; }
        public bool is_space_adjust { get; set; }
        public bool is_curve_width_adjust { get; set; }
        public /*int*/string color { get; set; }
        public decimal rectangle_scale_y { get; set; }

    }

    public class typ_side_data
    {
        public typ_parameters parameters { get; set; }
        public int numCurves { get; set; }
        public int idMaterial { get; set; }
        public int idSize { get; set; }


        //public string[] CurveColors { get; set; }
        //public decimal[][][] PointsCurves { get; set; }
        //public int[][] Segments_beg_points_numbers { get; set; } //01112024

        public bool Lockedit { get; set; }
        public bool Fl_manual_parameters { get; set; }
        public decimal M_Material { get; set; }
        public decimal M_Width { get; set; }
        public decimal M_Height { get; set; }
        public decimal M_Length { get; set; }
        public decimal M_Price_rub { get; set; }
        public decimal Part_gap { get; set; } //01112024
        public string[] CurveColors { get; set; }
        public int[][] Segments_beg_points_numbers { get; set; } //01112024
        public decimal[][][] PointsCurves { get; set; }

    }


    public class typ_model_data
    {
        public string stl_model_data { set; get; }
    };


    public class typ_make_model_result_data
    {

        public string common_outfilename_part { set; get; }

        public int number_outfiles { set; get; }

    };


    //******************************************************************************************************************
    public static class ProgressStatus
    {
        public static decimal ProgressValue { get; set; }

        internal static void SetPerc(decimal pv_Perc)
        {
            ProgressValue = pv_Perc;
        }

        internal static void AddToPerc(decimal pv_AddToPerc)
        {
            ProgressValue += pv_AddToPerc;
        }

        internal static void AddFractionWithin(decimal pvMaxPerc, decimal pv_FractionOfConstrain)
        {
            ProgressValue += pvMaxPerc * pv_FractionOfConstrain;
        }


    }
    //******************************************************************************************************************

    public class CalcModel
    {


        //--------------------------------------------------------------------------------------------------
        static decimal[][] FillTestData()
        {

            decimal[][] lar_TestPoints = new decimal[25][];

            lar_TestPoints[0] = new decimal[2] { 21.7M, 0 };
            lar_TestPoints[1] = new decimal[2] { 20.2M, 3.9M };
            lar_TestPoints[2] = new decimal[2] { 17.5M, 5.8M };
            lar_TestPoints[3] = new decimal[2] { 13.6M, 4.5M };
            lar_TestPoints[4] = new decimal[2] { 12.1M, 8.6M };
            lar_TestPoints[5] = new decimal[2] { 14.2M, 12.3M };
            lar_TestPoints[6] = new decimal[2] { 19.4M, 12.6M };
            lar_TestPoints[7] = new decimal[2] { 26.1M, 6.7M };
            lar_TestPoints[8] = new decimal[2] { 30.0M, 5.8M };
            lar_TestPoints[9] = new decimal[2] { 31.1M, 9.1M };
            lar_TestPoints[10] = new decimal[2] { 26.7M, 18.0M };
            lar_TestPoints[11] = new decimal[2] { 30.4M, 27.2M };
            lar_TestPoints[12] = new decimal[2] { 29.6M, 32.9M };
            lar_TestPoints[13] = new decimal[2] { 25.0M, 32.2M };
            lar_TestPoints[14] = new decimal[2] { 21.3M, 22.0M };
            lar_TestPoints[15] = new decimal[2] { 18.2M, 20.8M };
            lar_TestPoints[16] = new decimal[2] { 15.7M, 23.2M };
            lar_TestPoints[17] = new decimal[2] { 16.3M, 29.1M };
            lar_TestPoints[18] = new decimal[2] { 12.1M, 34.6M };
            lar_TestPoints[19] = new decimal[2] { 14.4M, 37.7M };
            lar_TestPoints[20] = new decimal[2] { 20.6M, 35.3M };
            lar_TestPoints[21] = new decimal[2] { 22.9M, 38.1M };
            lar_TestPoints[22] = new decimal[2] { 20.7M, 40.7M };
            lar_TestPoints[23] = new decimal[2] { 21.7M, 43.3M };
            lar_TestPoints[24] = new decimal[2] { 20.2M, 47.3M };


            return lar_TestPoints;
        }

        //--------------------------------------------------------------------------------------------------
        public static string RefreshModel(typ_sides_data? po_sides_data)
        {
            try
            {

                //return "";



                ProgressStatus.SetPerc(0);


                msgCore.InitKernel();

                msgScene lo_scene = msgScene.GetScene();
                lo_scene.Clear();


                double lv_box_width = double.Parse(po_sides_data.data1.M_Width.ToString());
                double lv_box_height = double.Parse(po_sides_data.data1.M_Height.ToString());
                double lv_box_length = double.Parse(po_sides_data.data1.M_Length.ToString());



                msgBox bx1 = msgBox.Create(lv_box_width, lv_box_length, lv_box_height); // - 10);
                                                                                        //////////msgVectorStruct trans_sp = new msgVectorStruct(-5, 2, 2);
                                                                                        //////////bx1.InitTempMatrix().Translate(trans_sp);
                                                                                        //////////bx1.ApplyTempMatrix();
                                                                                        //////////bx1.DestroyTempMatrix();
                lo_scene.AttachObject(bx1);


                ProgressStatus.SetPerc(5);


                const double cv_gap_width = 1;// ширина разделительных поверхностей (просвет между деталями)
                ///int lv_variant = 0;

                enum_model_side lv_side;


                // вертикальные разделители
                msg3DObject lo_separator1 = null;
                int lv_i_end1 = po_sides_data.data1.numCurves;

                for (int lv_i = 0; lv_i < lv_i_end1; lv_i++)
                {
                    ProgressStatus.AddFractionWithin(40, lv_i / lv_i_end1);


                    lv_side = enum_model_side.up_side;
                    lo_separator1 = GetSeparator(
                                        lo_scene,
                                        //lv_variant,
                                        lv_side,
                                        po_sides_data.data1.PointsCurves[lv_i],
                                        lv_box_length,
                                        lv_box_width,
                                        cv_gap_width
                                        );

                    if (lo_separator1 != null)
                    {
                        lo_scene.AttachObject(lo_separator1);
                    }
                }


                // Боковые разделители
                msg3DObject lo_separator2 = null;

                int lv_i_end2 = po_sides_data.data2.numCurves;

                for (int lv_i = 0; lv_i < lv_i_end2; lv_i++)
                {
                    ProgressStatus.AddFractionWithin(40, lv_i / lv_i_end2);

                    lv_side = enum_model_side.lateral_side;
                    lo_separator2 = GetSeparator(
                                        lo_scene,
                                        //lv_variant,
                                        lv_side,
                                        po_sides_data.data2.PointsCurves[lv_i],
                                        lv_box_length,
                                        lv_box_width,
                                        cv_gap_width
                                        );

                    if (lo_separator2 != null)
                    {
                        lo_scene.AttachObject(lo_separator2);
                    }
                }




                string lv_path_result_file = EndWork(lo_scene);

                ProgressStatus.SetPerc(100);


                return lv_path_result_file;


            }
            catch (Exception ex)
            {
                msgCore.FreeKernel(false);
                return ex.Message;

            }

        }

        //--------------------------------------------------------------------------------------------------
        public static typ_make_model_result_data MakeModel(typ_sides_data? po_sides_data)
        {
            try
            {

                ProgressStatus.SetPerc(0);

                msgCore.InitKernel();

                msgScene lo_scene = msgScene.GetScene();
                lo_scene.Clear();


                double lv_box_width = double.Parse(po_sides_data.data1.M_Width.ToString());
                double lv_box_height = double.Parse(po_sides_data.data1.M_Height.ToString());
                double lv_box_length = double.Parse(po_sides_data.data1.M_Length.ToString());



                msgBox bx1 = msgBox.Create(lv_box_width, lv_box_length, lv_box_height); // - 10);

                //////////msgVectorStruct trans_sp = new msgVectorStruct(-5, 2, 2);
                //////////bx1.InitTempMatrix().Translate(trans_sp);
                //////////bx1.ApplyTempMatrix();
                //////////bx1.DestroyTempMatrix();



                //////////////////////////////////////////////lo_scene.AttachObject(bx1);




                const double cv_gap_width = 1;// ширина разделительных поверхностей (просвет между деталями)
                ///int lv_variant = 0;

                enum_model_side lv_side;

                // стек разделителей
                Stack<msg3DObject> lar_stack_separators = new Stack<msg3DObject>();

                // вертикальные разделители
                int lv_i_end1 = po_sides_data.data1.numCurves;
                msg3DObject lo_separator1 = null;
                for (int lv_i = 0; lv_i < lv_i_end1; lv_i++)
                {

                    ProgressStatus.AddFractionWithin(40, lv_i / lv_i_end1);

                    //if (lv_i == 1)
                    //{
                    ////int lv_num_separator = lv_i + 1;
                    lv_side = enum_model_side.up_side;
                    lo_separator1 = GetSeparator(
                                        lo_scene,
                                        //lv_variant,
                                        lv_side,
                                        ////lv_num_separator,
                                        po_sides_data.data1.PointsCurves[lv_i],
                                        lv_box_length,
                                        lv_box_width,
                                        cv_gap_width
                                        );

                    if (lo_separator1 != null)
                    {
                        ////////lo_scene.AttachObject(lo_separator1);
                        ////// substraction
                        ////do_sub(lo_scene, bx1, lo_separator1);

                        lar_stack_separators.Push(lo_separator1);

                    }

                    //}
                }


                // Боковые разделители
                int lv_i_end2 = po_sides_data.data2.numCurves;
                msg3DObject lo_separator2 = null;
                for (int lv_i = 0; lv_i < lv_i_end2; lv_i++)
                {
                    ProgressStatus.AddFractionWithin(40, lv_i / lv_i_end2);

                    lv_side = enum_model_side.lateral_side;
                    ////int lv_num_separator = lv_i + 1;

                    lo_separator2 = GetSeparator(
                                        lo_scene,
                                        //lv_variant,
                                        lv_side,
                                        ////lv_num_separator,
                                        po_sides_data.data2.PointsCurves[lv_i],
                                        lv_box_length,
                                        lv_box_width,
                                        cv_gap_width
                                        );

                    if (lo_separator2 != null)
                    {
                        //////lo_scene.AttachObject(lo_separator2);
                        //// substraction
                        //do_sub(lo_scene, bx1, lo_separator2);

                        lar_stack_separators.Push(lo_separator2);

                    }


                }


                //// substraction
                //do_sub(lo_scene, bx1, lo_separator1);


                // Разрезание
                ProgressStatus.SetPerc(90);

                Stack<msg3DObject>? lar_stack_result_details = null;



                string lv_common_path_result_files = "";


                /////lar_stack_result_details = do_cutting(lo_scene, bx1, lar_stack_separators);
                //lv_common_path_result_files = do_cutting(lo_scene, bx1, lar_stack_separators);


                ////foreach (msg3DObject lo_curr_res_part in lar_stack_result_details)
                ////{
                ////    lo_scene.AttachObject(lo_curr_res_part);
                ////}


                typ_make_model_result_data lv_result_data = do_cutting(lo_scene, bx1, lar_stack_separators);

                msgCore.FreeKernel(false);

                ProgressStatus.SetPerc(100);

                ////string lv_path_result_file = EndWork(lo_scene);

                ///return lv_path_result_file;


                return lv_result_data;

            }
            catch (Exception ex)
            {

                msgCore.FreeKernel(false);

                typ_make_model_result_data lv_result_data = new typ_make_model_result_data();
                lv_result_data.common_outfilename_part = "Making model error";
                lv_result_data.number_outfiles = 0;

                return lv_result_data;

                //return ex.Message;

            }

        }



        //--------------------------------------------------------------------------------------------------
        private static msg3DObject GetSeparator(
                msgScene po_scene,
                enum_model_side pv_side /*int pv_variant*/,
                ////int pv_num_separator,
                decimal[][] par_TestPoints,
                double pv_box_length,
                double pv_box_width,
                double pv_gap_width
            )
        {

            const int SMOOTH = 200; // 130;// 135;// 150;//!!     120; //50;// 

            msg3DObject result = null;

            // create original spline

            const double cv_extra_size = 5; // 10.0; // Выступ поверхностей за границы модели 

            int lv_ibegpoint = 0;
            int lv_iendpoint = par_TestPoints.Length - 1;


            msgPointStruct ls_tmpPnt = new msgPointStruct();
            msgSplineStruct lo_original_splinestruc = msgSplineStruct.Create();

            int lv_ind_struc = 0;

            try
            {

                ls_tmpPnt.x = (double)par_TestPoints[0][0];
                ls_tmpPnt.y = (double)par_TestPoints[0][1] - cv_extra_size;
                ls_tmpPnt.z = 0.0;
                lo_original_splinestruc.AddKnot(ls_tmpPnt, lv_ind_struc++);

                for (int icurr = lv_ibegpoint; icurr <= lv_iendpoint; icurr++)
                {
                    ls_tmpPnt.x = (double)par_TestPoints[icurr][0]; // + lv_curve_shift;
                    ls_tmpPnt.y = (double)par_TestPoints[icurr][1];
                    ls_tmpPnt.z = 0.0;

                    lo_original_splinestruc.AddKnot(ls_tmpPnt, lv_ind_struc++);
                }

                // Дополнительный узел для выход поверхности за размеры разрезаемого тела
                ls_tmpPnt.y = ls_tmpPnt.y + cv_extra_size;
                ls_tmpPnt.z = 0.0;

                lo_original_splinestruc.AddKnot(ls_tmpPnt, lv_ind_struc);




                // Spline with original curve

                msgSpline lo_original_spline = msgSpline.Create(lo_original_splinestruc);

                //07102024 msgSplineStruct.Delete(lo_original_splinestruc);





                //25092024 {


                //sgCObject* lnes[SMOOTH];
                msgObject[] lnes = new msgObject[SMOOTH];


                for (int i = 0; i < SMOOTH; i++)
                {
                    //SG_POINT p1 = sssss->GetPointFromCoefficient((double)i / SMOOTH);
                    msgPointStruct p1 = lo_original_spline.GetPointFromCoefficient((double)i / SMOOTH);

                    //SG_POINT p2 = sssss->GetPointFromCoefficient((double)(i + 1) / SMOOTH);
                    msgPointStruct p2 = lo_original_spline.GetPointFromCoefficient((double)(i + 1) / SMOOTH);

                    //lnes[i] = sgCreateLine(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                    lnes[i] = msgLine.Create(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);

                }

                //sgDeleteObject(sssss);
                msgSplineStruct.Delete(lo_original_splinestruc);



                //sgC2DObject* cnt2 = sgCContour::CreateContour(&lnes[0], SMOOTH);
                msg2DObject cnt2 = msgContour.CreateContour(lnes);

                //25092024 }




                //construct a cutting solid is through pipe

                msgObject[] ls_pipe_objcts = new msgObject[4];

                ls_pipe_objcts[0] = msgLine.Create(0.0, 0.0, -cv_extra_size, pv_gap_width, 0.0, -cv_extra_size);
                ls_pipe_objcts[1] = msgLine.Create(pv_gap_width, 0.0, -cv_extra_size, pv_gap_width, 0.0, pv_box_width + cv_extra_size);
                ls_pipe_objcts[2] = msgLine.Create(pv_gap_width, 0.0, pv_box_width + cv_extra_size, 0.0, 0.0, pv_box_width + cv_extra_size);
                ls_pipe_objcts[3] = msgLine.Create(0.0, 0.0, pv_box_width + cv_extra_size, 0.0, 0.0, -cv_extra_size);

                msgContour lo_countour = msgContour.CreateContour(ls_pipe_objcts);

                msgPointStruct ls_pipe_ps = new msgPointStruct(0, 0, 0);
                bool lv_is_pipe_close = true;


                //10102024 msg3DObject lo_spline_piped = (msg3DObject)msgKinematic.Pipe(lo_countour, null, lo_original_spline, ls_pipe_ps, 0, ref lv_is_pipe_close);//01062024
                msg3DObject lo_spline_piped = (msg3DObject)msgKinematic.Pipe(lo_countour, null, cnt2, ls_pipe_ps, 0, ref lv_is_pipe_close);




                //string lv_name_separator = "";

                //po_scene.AttachObject(original_spline_piped);
                switch (pv_side)
                {
                    // верхняя сторона
                    case enum_model_side.up_side:
                        //lv_name_separator = pv_num_separator.ToString();
                        break;

                    // боковая сторона - поворот и сдвиг
                    case enum_model_side.lateral_side:

                        //lv_name_separator = "_" + pv_num_separator.ToString();

                        msgPointStruct zeroP = new msgVectorStruct(0, 0, 0);
                        msgVectorStruct yAxe = new msgVectorStruct(0, 1.0, 0);
                        double M_PI = Math.PI;

                        lo_spline_piped.InitTempMatrix().Rotate(zeroP, yAxe, 90.0 * M_PI / 180.0);
                        lo_spline_piped.ApplyTempMatrix();
                        lo_spline_piped.DestroyTempMatrix();

                        msgVectorStruct transV = new msgVectorStruct(0, 0, pv_box_width);
                        lo_spline_piped.InitTempMatrix().Translate(transV);
                        lo_spline_piped.ApplyTempMatrix();
                        lo_spline_piped.DestroyTempMatrix();

                        break;

                }

                //lo_spline_piped.SetName(lv_name_separator);

                result = lo_spline_piped;





                ////////        //switch (pv_variant)
                ////////        switch (pv_side)
                ////////{


                ////////    //case 1:
                ////////    case enum_model_side.up_side:

                //////////////The first way to construct a cutting solid is through pipe

                //////////// 1) rectangular countour
                //////////msgObject[] ls_pipe_objcts = new msgObject[4];

                //////////////ls_pipe_objcts[0] = msgLine.Create(0.0, 0.0, -10.0, 2, 0.0, -10.0);
                //////////////ls_pipe_objcts[1] = msgLine.Create(2, 0.0, -10.0, 2, 0.0, pv_box_width+10);
                //////////////ls_pipe_objcts[2] = msgLine.Create(2, 0.0, pv_box_width+10, 0.0, 0.0, pv_box_width+10);
                //////////////ls_pipe_objcts[3] = msgLine.Create(0.0, 0.0, pv_box_width+10, 0.0, 0.0, -10.0);
                //////////ls_pipe_objcts[0] = msgLine.Create(0.0, 0.0, -cv_extra_size, pv_gap_width, 0.0, -cv_extra_size);
                //////////ls_pipe_objcts[1] = msgLine.Create(pv_gap_width, 0.0, -cv_extra_size, pv_gap_width, 0.0, pv_box_width+ cv_extra_size);
                //////////ls_pipe_objcts[2] = msgLine.Create(pv_gap_width, 0.0, pv_box_width+ cv_extra_size, 0.0, 0.0, pv_box_width+ cv_extra_size);
                //////////ls_pipe_objcts[3] = msgLine.Create(0.0, 0.0, pv_box_width+ cv_extra_size, 0.0, 0.0, -10.0);

                //////////msgContour lo_countour = msgContour.CreateContour(ls_pipe_objcts);


                //////////msgPointStruct ls_pipe_ps = new msgPointStruct(0, 0, 0);
                //////////bool lv_is_pipe_close = true;
                //////////msg3DObject lo_spline_piped = (msg3DObject)msgKinematic.Pipe(lo_countour, null, lo_original_spline, ls_pipe_ps, 0, ref lv_is_pipe_close);//01062024
                ////////////po_scene.AttachObject(original_spline_piped);




                ////////    result = lo_spline_piped;

                ////////    break;


                //////////case 2:


                ////////case enum_model_side.lateral_side:


                ////////:
                ////////                    //The first way to construct a cutting surface is through through equidistant curves and extrusion

                ////////                    double lv_half_thickness = 1; // half the thickness of the cutting surface


                ////////                    // Construction of equidistant curves on both sides of the spline
                ////////                    msgContour equiContour1 = lo_original_spline.GetEquidistantContour(lv_half_thickness, lv_half_thickness, true);
                ////////                    msgContour equiContour2 = lo_original_spline.GetEquidistantContour(-lv_half_thickness, -lv_half_thickness, true);


                ////////                    // creating a closed slide through two equidistant curves

                ////////                    equiContour2.ChangeOrient();


                ////////                    int lv_numPoints = lv_iendpoint - lv_ibegpoint + 1;
                ////////                    int lv_double_num_points = lv_numPoints * 2;


                ////////                    msgPointStruct ls_PntStruc = new msgPointStruct();
                ////////                    msgSplineStruct lo_close_spline_struct = msgSplineStruct.Create();


                ////////                    int lv_i = 0;

                ////////                    for (lv_i = 0; lv_i <= lv_double_num_points; lv_i++)
                ////////                    {
                ////////                        if (lv_i < lv_numPoints + 1)
                ////////                        {
                ////////                            ls_PntStruc = equiContour1.GetPointFromCoefficient(lv_i / (double)lv_numPoints);
                ////////                            ls_PntStruc.z = 0;
                ////////                            lo_close_spline_struct.AddKnot(ls_PntStruc, lv_i);
                ////////                        }
                ////////                        else
                ////////                        {
                ////////                            ls_PntStruc = equiContour2.GetPointFromCoefficient((lv_i - (lv_numPoints + 1)) / (double)lv_numPoints);
                ////////                            ls_PntStruc.z = 0;
                ////////                            lo_close_spline_struct.AddKnot(ls_PntStruc, lv_i);
                ////////                        }

                ////////                    }

                ////////                    ls_PntStruc = equiContour1.GetPointFromCoefficient(0);
                ////////                    ls_PntStruc.z = 0;
                ////////                    lo_close_spline_struct.AddKnot(ls_PntStruc, lv_double_num_points + 1);

                ////////                    lo_close_spline_struct.Close();


                ////////                    msgSpline lo_close_spline = msgSpline.Create(lo_close_spline_struct);

                ////////                    bool lv_is = lo_close_spline.IsClosed();


                ////////                    //msgObject[] contour_objcts = new msgObject[4];
                ////////                    //contour_objcts[0] = equiContour1;
                ////////                    //contour_objcts[1] = equiContour2;
                ////////                    //msgContour lo_common_countour = msgContour.CreateContour(contour_objcts);

                ////////                    msgVectorStruct lo_EquiExtrudeVector = new msgVectorStruct(0, 0, 5);//052024



                ////////                    //msg3DObject lo_original_spline_extruded = (msg3DObject)msgKinematic.Extrude(lo_original_spline, null, lo_EquiExtrudeVector, true);
                ////////                    //po_scene.AttachObject(lo_original_spline_extruded);//01062024 îòëàäêà!! Ïîòîì óáðàòü! 


                ////////                    msg3DObject lo_Equidistan_contour_extruded1 = (msg3DObject)msgKinematic.Extrude(equiContour1, null, lo_EquiExtrudeVector, true);
                ////////                    msg3DObject lo_Equidistan_contour_extruded2 = (msg3DObject)msgKinematic.Extrude(equiContour2, null, lo_EquiExtrudeVector, true);
                ////////                    po_scene.AttachObject(lo_Equidistan_contour_extruded1);
                ////////                    po_scene.AttachObject(lo_Equidistan_contour_extruded2);


                ////////                    //msg3DObject lo_close_spline_extruded = (msg3DObject)msgKinematic.Extrude(lo_close_spline, null, lo_EquiExtrudeVector, true);// error!
                ////////                    // error!

                ////////                    //po_scene.AttachObject(lo_close_spline_extruded);

                ////////                    //result = lo_close_spline_extruded;

                ////////                    break;
                ///

                ////////        break;

                ////////}


            }
            catch (Exception ex)
            {
                return null;

            }

            return result;

        }


        //--------------------------------------------------------------------------------------------------
        ////private static Stack<msg3DObject>? do_cutting(msgScene po_scene, msgBox lo_body, Stack<msg3DObject> par_separators)
        private static typ_make_model_result_data? do_cutting(msgScene po_scene, msgBox lo_body, Stack<msg3DObject> par_separators)
        {
            //Stack<msg3DObject> lar_result_details = new Stack<msg3DObject>();

            const double lv_delta = 0.1; // погрешность длины детали

            Stack<msg3DObject> lar_input_parts = new Stack<msg3DObject>();
            Stack<msg3DObject> lar_output_parts = new Stack<msg3DObject>();



            msgGroup lo_group_result = null;
            msgObject[] lar_sub_res_parts = null;

            msgPointStruct lo_gabarit_body_min = new msgPointStruct();
            msgPointStruct lo_gabarit_body_max = new msgPointStruct();
            msgPointStruct lo_gabarit_body = new msgPointStruct();

            msgPointStruct lo_gabarit_part_min = new msgPointStruct();
            msgPointStruct lo_gabarit_part_max = new msgPointStruct();
            msgPointStruct lo_curr_gabarits = new msgPointStruct();

            ////msgPointStruct lo_gabarit_separat_min = new msgPointStruct();
            ////msgPointStruct lo_gabarit_separat_max = new msgPointStruct();


            lo_body.GetGabarits(lo_gabarit_body_min, lo_gabarit_body_max);
            lo_gabarit_body.x = Math.Abs(lo_gabarit_body_max.x - lo_gabarit_body_min.x);
            lo_gabarit_body.y = Math.Abs(lo_gabarit_body_max.y - lo_gabarit_body_min.y);
            lo_gabarit_body.z = Math.Abs(lo_gabarit_body_max.z - lo_gabarit_body_min.z);

            //----------------------------------------------------------------------------------

            lar_input_parts.Push(lo_body);

            foreach (msg3DObject lo_curr_separator in par_separators)
            {

                lar_output_parts.Clear();

                foreach (msg3DObject lo_curr_part in lar_input_parts)
                {

                    lo_group_result = msgBoolean.Sub(lo_curr_part, lo_curr_separator);


                    //if (lo_group_result == null)
                    //{
                    //    string lv_null = "null";
                    //}


                    if (lo_group_result.isNull())
                    {
                        if (lo_curr_part != lo_body)
                        {
                            lar_output_parts.Push(lo_curr_part);
                        }

                        continue;
                    }
                    else
                    {
                        lo_group_result.BreakGroup(ref lar_sub_res_parts);

                        foreach (msg3DObject lo_curr_res_part in lar_sub_res_parts)
                        {
                            // Отбор результирующих деталей для дальнейшей резки:
                            // - минимальная координата по Y д.б. равна 0;
                            // - максимальный размер деталей не должен быть меньше длины исходной фигуры
                            lo_curr_res_part.GetGabarits(lo_gabarit_part_min, lo_gabarit_part_max);

                            if (lo_gabarit_part_min.y > lv_delta || lo_gabarit_part_max.y < lo_gabarit_body.y - lv_delta)
                            {
                                continue;
                            }

                            lar_output_parts.Push(lo_curr_res_part);

                        }

                    }

                }

                // перезапись промежуточных частей во входной массив
                if (lar_output_parts.Count > 0)
                {
                    lar_input_parts.Clear();
                    foreach (msg3DObject lo_curr_res_part in lar_output_parts)
                    {
                        lar_input_parts.Push(lo_curr_res_part);
                    }
                }

            }


            ////lar_result_details.Clear();
            ////foreach (msg3DObject lo_curr_res_part in lar_output_parts)
            ////{
            ////    lar_result_details.Push(lo_curr_res_part);
            ////}




            // сохранение отдельных деталей в промежуточных файлах для чтения
            // модели в клиенте

            //double[] lar_parts_x = { };
            //double[] lar_parts_z = { };

            int lv_i = 1;



            string lv_dir_to_save = Path.Combine(Environment.CurrentDirectory,
                                                    Path.Combine(CommonConstants.path_AppData,
                                                        CommonConstants.path_temp_data));
            Commons.create_directory_if_no_exist(lv_dir_to_save);


            string lv_common_part_filename = HandlePathsAndNames.get_random_name();

            string lv_path_file_to_save = "";

            //po_scene.Clear();
            foreach (msg3DObject lo_curr_res_part in lar_output_parts)
            {
                po_scene.AttachObject(lo_curr_res_part);

                lv_path_file_to_save = Path.Combine(lv_dir_to_save, lv_common_part_filename + "_" + lv_i++.ToString() + ".stl");

                msgFileManager.ExportSTL(po_scene, lv_path_file_to_save);
                po_scene.DetachObject(lo_curr_res_part);
            }

            typ_make_model_result_data lo_result_data = new typ_make_model_result_data();

            lo_result_data.common_outfilename_part = lv_common_part_filename;
            lo_result_data.number_outfiles = lar_output_parts.Count;



            //////return lar_result_details;
            ////return lar_output_parts;
            ///
            ////return lv_common_part_filename;

            return lo_result_data;
        }

        //////-------------------------------------------------------------------------------
        ////private static bool IsIntersect(msg3DObject po_obj1, msg3DObject po_obj2)
        ////{
        ////    bool lv_result = false;


        ////    msgPointStruct lo_obj1_min = new msgPointStruct();
        ////    msgPointStruct lo_obj1_max = new msgPointStruct();

        ////    msgPointStruct lo_obj2_min = new msgPointStruct();
        ////    msgPointStruct lo_obj2_max = new msgPointStruct();


        ////    po_obj1.GetGabarits(lo_obj1_min, lo_obj1_max);
        ////    po_obj2.GetGabarits(lo_obj2_min, lo_obj2_max);



        ////    lv_result =

        ////        (
        ////            ((lo_obj1_min.x >= lo_obj2_min.x && lo_obj1_min.x <= lo_obj2_max.x)
        ////              || (lo_obj1_max.x >= lo_obj2_min.x && lo_obj1_max.x <= lo_obj2_max.x))
        ////            &&
        ////            ((lo_obj1_min.y >= lo_obj2_min.y && lo_obj1_min.y <= lo_obj2_max.y)
        ////              || (lo_obj1_max.y >= lo_obj2_min.y && lo_obj1_max.y <= lo_obj2_max.y))
        ////            &&
        ////            ((lo_obj1_min.z >= lo_obj2_min.z && lo_obj1_min.z <= lo_obj2_max.z)
        ////              || (lo_obj1_max.z >= lo_obj2_min.z && lo_obj1_max.z <= lo_obj2_max.z))
        ////        );

        ////    return lv_result;
        ////    //throw new NotImplementedException();
        ////}


        //-------------------------------------------------------------------------------
        ////private static bool IsBetween(msgPointStruct po_outer_min, msgPointStruct po_outer_max, msgPointStruct po_inner_min, msgPointStruct po_inner_max)
        ////{
        ////    bool lv_result = false;

        ////    lv_result =

        ////        (
        ////            ((po_inner_min.x >= po_outer_min.x && po_inner_min.x <= po_outer_max.x)
        ////              || (po_inner_max.x >= po_outer_min.x && po_inner_max.x <= po_outer_max.x))
        ////            &&
        ////            ((po_inner_min.y >= po_outer_min.y && po_inner_min.y <= po_outer_max.y)
        ////              || (po_inner_max.y >= po_outer_min.y && po_inner_max.y <= po_outer_max.y))
        ////            &&
        ////            ((po_inner_min.z >= po_outer_min.z && po_inner_min.z <= po_outer_max.z)
        ////              || (po_inner_max.z >= po_outer_min.z && po_inner_max.z <= po_outer_max.z))
        ////        );


        ////    return lv_result;
        ////}


        //--------------------------------------------------------------------------------------------------
        private static void do_sub(msgScene po_scene, msg3DObject po_minuend, msg3DObject po_subtrahend)
        {
            msgGroup lo_bool_result = null;

            lo_bool_result = msgBoolean.Sub(po_minuend, po_subtrahend);// Error! bool_result is empty
                                                                       // Error! bool_result is empty


            msgObject[] lar_parts = null;

            lo_bool_result.BreakGroup(ref lar_parts);
            for (int icurr = 0; icurr < lar_parts.Length; icurr++)
            {
                po_scene.AttachObject(lar_parts[icurr]);
            }

        }
        //--------------------------------------------------------------------------------------------------

        static string EndWork(msgScene po_scene)
        {
            string lv_flename = Path.GetFileName(Path.GetTempFileName());

            //string lv_path_to_export = Path.Combine(Environment.CurrentDirectory, @"test_data/testResult.stl");
            string lv_path_to_export = Path.Combine(Environment.CurrentDirectory, @"test_data" + Path.DirectorySeparatorChar + lv_flename);
            msgFileManager.ExportSTL(po_scene, lv_path_to_export);

            msgCore.FreeKernel(false);


            //string lv_stl_text = "";
            //try
            //{
            //    using (StreamReader lo_sr = new StreamReader(lv_path_to_export))
            //    {
            //        lv_stl_text = lo_sr.ReadToEnd();
            //    }
            //}
            //catch (Exception ex)
            //{

            //}


            return lv_path_to_export;
        }

    }
    //==========================================================================================================



}



////using sgCoreWrapper;
////using sgCoreWrapper.Objects;
////using sgCoreWrapper.Helpers;
////using sgCoreWrapper.Interfaces;
////using sgCoreWrapper.Structs;

////using Newtonsoft.Json;
////using System.Diagnostics.Contracts;
////using System.Runtime.Intrinsics.X86;

////namespace jb_api_shg.AppCode
////{





////////////****************************************************************************************************

////////////public class typ_model_data
////////////{

////////////    public typ_color_data ColorParts { set; get; }

////////////    public typ_ob_data data1 { set; get; }
////////////    public typ_ob_data data2 { set; get; }

////////////};


////////////public class typ_color_data
////////////{
////////////    public string[][] ColorParts { set; get; }
////////////}


////////////public class typ_ob_data
////////////{
////////////    public int numCurves { get; set; }

////////////    public int idMaterial { get; set; }
////////////    public int idSize { get; set; }


////////////    public string[] CurveColors { get; set; }
////////////    public decimal[][][] PointsCurves { get; set; }

////////////    public bool Lockedit { get; set; }
////////////    public bool Fl_manual_parameters { get; set; }
////////////    public decimal M_Material { get; set; }
////////////    public decimal M_Width { get; set; }
////////////    public decimal M_Height { get; set; }
////////////    public decimal M_Length { get; set; }
////////////    public decimal M_Price_rub { get; set; }

////////////}




////////////****************************************************************************************************

//////////public enum enum_model_side
//////////{
//////////    up_side,
//////////    lateral_side
//////////}

//////////public class typ_sides_data
//////////{
//////////    public typ_color_data ColorParts { set; get; }
//////////    public typ_side_data data1 { set; get; }
//////////    public typ_side_data data2 { set; get; }

//////////};


//////////public class typ_color_data
//////////{
//////////    public string[][] ColorParts { set; get; }
//////////}


//////////public class typ_side_data
//////////{
//////////    public int numCurves { get; set; }

//////////    public int idMaterial { get; set; }
//////////    public int idSize { get; set; }


//////////    public string[] CurveColors { get; set; }
//////////    public decimal[][][] PointsCurves { get; set; }

//////////    public bool Lockedit { get; set; }
//////////    public bool Fl_manual_parameters { get; set; }
//////////    public decimal M_Material { get; set; }
//////////    public decimal M_Width { get; set; }
//////////    public decimal M_Height { get; set; }
//////////    public decimal M_Length { get; set; }
//////////    public decimal M_Price_rub { get; set; }

//////////}


//////////public class typ_model_data
//////////{

//////////    public string stl_model_data { set; get; }


//////////};


////////////******************************************************************************************************************


//////////public class CalcModel
//////////{


//////////    //--------------------------------------------------------------------------------------------------
//////////    static decimal[][] FillTestData()
//////////    {

//////////        decimal[][] lar_TestPoints = new decimal[25][];

//////////        lar_TestPoints[0] = new decimal[2] { 21.7M, 0 };
//////////        lar_TestPoints[1] = new decimal[2] { 20.2M, 3.9M };
//////////        lar_TestPoints[2] = new decimal[2] { 17.5M, 5.8M };
//////////        lar_TestPoints[3] = new decimal[2] { 13.6M, 4.5M };
//////////        lar_TestPoints[4] = new decimal[2] { 12.1M, 8.6M };
//////////        lar_TestPoints[5] = new decimal[2] { 14.2M, 12.3M };
//////////        lar_TestPoints[6] = new decimal[2] { 19.4M, 12.6M };
//////////        lar_TestPoints[7] = new decimal[2] { 26.1M, 6.7M };
//////////        lar_TestPoints[8] = new decimal[2] { 30.0M, 5.8M };
//////////        lar_TestPoints[9] = new decimal[2] { 31.1M, 9.1M };
//////////        lar_TestPoints[10] = new decimal[2] { 26.7M, 18.0M };
//////////        lar_TestPoints[11] = new decimal[2] { 30.4M, 27.2M };
//////////        lar_TestPoints[12] = new decimal[2] { 29.6M, 32.9M };
//////////        lar_TestPoints[13] = new decimal[2] { 25.0M, 32.2M };
//////////        lar_TestPoints[14] = new decimal[2] { 21.3M, 22.0M };
//////////        lar_TestPoints[15] = new decimal[2] { 18.2M, 20.8M };
//////////        lar_TestPoints[16] = new decimal[2] { 15.7M, 23.2M };
//////////        lar_TestPoints[17] = new decimal[2] { 16.3M, 29.1M };
//////////        lar_TestPoints[18] = new decimal[2] { 12.1M, 34.6M };
//////////        lar_TestPoints[19] = new decimal[2] { 14.4M, 37.7M };
//////////        lar_TestPoints[20] = new decimal[2] { 20.6M, 35.3M };
//////////        lar_TestPoints[21] = new decimal[2] { 22.9M, 38.1M };
//////////        lar_TestPoints[22] = new decimal[2] { 20.7M, 40.7M };
//////////        lar_TestPoints[23] = new decimal[2] { 21.7M, 43.3M };
//////////        lar_TestPoints[24] = new decimal[2] { 20.2M, 47.3M };


//////////        return lar_TestPoints;
//////////    }

//////////    //--------------------------------------------------------------------------------------------------
//////////    public static void BuildModel()
//////////    {


//////////        decimal[][] lar_TestPoints = FillTestData();

//////////        msgCore.InitKernel();
//////////        msgScene lo_scene = msgScene.GetScene();
//////////        lo_scene.Clear();


//////////        const double cv_box_length = 130;
//////////        const double cv_box_width = 50;
//////////        int lv_variant = 0;

//////////        //-----------   variant 1   ------------------------
//////////        lv_variant = 1; // separator = pipe
//////////        msg3DObject lo_separator1 = GetSeparator(
//////////                                        lo_scene,
//////////                                        lv_variant,
//////////                                        lar_TestPoints,
//////////                                        cv_box_length,
//////////                                        cv_box_width
//////////                                        );

//////////        if (lo_separator1 != null)
//////////        {
//////////            //25092024 lo_scene.AttachObject(lo_separator1);
//////////        }

//////////        msgBox bx1 = msgBox.Create(cv_box_width, cv_box_width - 10, cv_box_width);
//////////        msgVectorStruct trans_sp = new msgVectorStruct(-5, 2, 2);
//////////        bx1.InitTempMatrix().Translate(trans_sp);
//////////        bx1.ApplyTempMatrix();
//////////        bx1.DestroyTempMatrix();
//////////        //25092024 lo_scene.AttachObject(bx1);


//////////        // substraction
//////////        do_sub(lo_scene, bx1, lo_separator1);



//////////        //-----------   variant 2   ------------------------

//////////        //lv_variant = 2; // separator = extruded
//////////        //msg3DObject lo_separator2 = GetSeparator(
//////////        //                                lo_scene,
//////////        //                                lv_variant,
//////////        //                                lar_TestPoints,
//////////        //                                cv_box_length,
//////////        //                                cv_box_width
//////////        //                                );
//////////        //if (lo_separator2 != null)
//////////        //{
//////////        //    lo_scene.AttachObject(lo_separator2);
//////////        //}

//////////        //msgBox bx2 = msgBox.Create(cv_box_width, cv_box_length - 20, cv_box_length);//03062024
//////////        //msgVectorStruct trans_sp2 = new msgVectorStruct(-10, 10, 0);
//////////        //bx2.InitTempMatrix().Translate(trans_sp2);
//////////        //bx2.ApplyTempMatrix();
//////////        //bx2.DestroyTempMatrix();
//////////        //lo_scene.AttachObject(bx2);


//////////        // substraction
//////////        //do_sub(lo_scene, bx2, lo_separator2);


//////////        EndWork(lo_scene);

//////////    }


//////////    //--------------------------------------------------------------------------------------------------
//////////    private static msg3DObject GetSeparator(msgScene po_scene, int pv_variant, decimal[][] par_TestPoints, double cv_box_length, double cv_box_width)
//////////    {
//////////        msg3DObject result = null;

//////////        // create original spline

//////////        int lv_ibegpoint = 0;
//////////        int lv_iendpoint = par_TestPoints.Length - 1;

//////////        double lv_curve_shift = cv_box_width * 1.5;
//////////        switch (pv_variant)
//////////        {
//////////            case 1:
//////////                lv_curve_shift = 0;
//////////                break;

//////////            case 2:
//////////                lv_curve_shift = 50;
//////////                break;

//////////        }



//////////        msgPointStruct ls_tmpPnt = new msgPointStruct();
//////////        msgSplineStruct lo_original_splinestruc = msgSplineStruct.Create();

//////////        int lv_ind_struc = 0;
//////////        for (int icurr = lv_ibegpoint; icurr <= lv_iendpoint; icurr++)
//////////        {
//////////            ls_tmpPnt.x = ((double)par_TestPoints[icurr][0]) + lv_curve_shift;
//////////            ls_tmpPnt.y = ((double)par_TestPoints[icurr][1]);
//////////            ls_tmpPnt.z = 0.0;

//////////            lo_original_splinestruc.AddKnot(ls_tmpPnt, lv_ind_struc++);
//////////        }

//////////        // Spline with original curve
//////////        msgSpline lo_original_spline = msgSpline.Create(lo_original_splinestruc);
//////////        //25092024 {msgSplineStruct.Delete(lo_original_splinestruc);





//////////        //25092024 {

//////////        const int SMOOTH = 170;// 150;//!!     120; //50;// 

//////////        //sgCObject* lnes[SMOOTH];
//////////        msgObject[] lnes = new msgObject[SMOOTH];


//////////        for (int i = 0; i < SMOOTH; i++)
//////////        {
//////////            //SG_POINT p1 = sssss->GetPointFromCoefficient((double)i / SMOOTH);
//////////            msgPointStruct p1 = lo_original_spline.GetPointFromCoefficient((double)i / SMOOTH);


//////////            //SG_POINT p2 = sssss->GetPointFromCoefficient((double)(i + 1) / SMOOTH);
//////////            msgPointStruct p2 = lo_original_spline.GetPointFromCoefficient((double)(i + 1) / SMOOTH);

//////////            //lnes[i] = sgCreateLine(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
//////////            lnes[i] = msgLine.Create(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);

//////////        }

//////////        //sgDeleteObject(sssss);
//////////        msgSplineStruct.Delete(lo_original_splinestruc);



//////////        //sgC2DObject* cnt2 = sgCContour::CreateContour(&lnes[0], SMOOTH);
//////////        msg2DObject cnt2 = msgContour.CreateContour(lnes);



//////////        //25092024 }








//////////        switch (pv_variant)
//////////        {


//////////            case 1:
//////////                //The first way to construct a cutting solid is through pipe


//////////                double lv_dept = (cv_box_width + 10);// / 2; //25092024
//////////                // 1) rectangular countour
//////////                msgObject[] ls_pipe_objcts = new msgObject[4];
//////////                ls_pipe_objcts[0] = msgLine.Create(0.0, 0.0, -10.0, 2, 0.0, -10.0);
//////////                ls_pipe_objcts[1] = msgLine.Create(2, 0.0, -10.0, 2, 0.0, lv_dept);
//////////                ls_pipe_objcts[2] = msgLine.Create(2, 0.0, lv_dept, 0.0, 0.0, lv_dept);
//////////                ls_pipe_objcts[3] = msgLine.Create(0.0, 0.0, lv_dept, 0.0, 0.0, -10.0);

//////////                msgContour lo_countour = msgContour.CreateContour(ls_pipe_objcts);


//////////                msgPointStruct ls_pipe_ps = new msgPointStruct(0, 0, 0);
//////////                bool lv_is_pipe_close = true;


//////////                //25092024 {

//////////                //msg3DObject lo_spline_piped = (msg3DObject)msgKinematic.Pipe(lo_countour, null, lo_original_spline, ls_pipe_ps, 0, ref lv_is_pipe_close);
//////////                msg3DObject lo_spline_piped = (msg3DObject)msgKinematic.Pipe(lo_countour, null, cnt2, ls_pipe_ps, 0, ref lv_is_pipe_close);

//////////                //25092024 }




//////////                result = lo_spline_piped;

//////////                break;


//////////            case 2:
//////////                //The first way to construct a cutting surface is through through equidistant curves and extrusion

//////////                double lv_half_thickness = 1; // half the thickness of the cutting surface


//////////                // Construction of equidistant curves on both sides of the spline
//////////                msgContour equiContour1 = lo_original_spline.GetEquidistantContour(lv_half_thickness, lv_half_thickness, true);
//////////                msgContour equiContour2 = lo_original_spline.GetEquidistantContour(-lv_half_thickness, -lv_half_thickness, true);







//////////                // creating a closed slide through two equidistant curves

//////////                equiContour2.ChangeOrient();


//////////                int lv_numPoints = lv_iendpoint - lv_ibegpoint + 1;
//////////                int lv_double_num_points = lv_numPoints * 2;


//////////                msgPointStruct ls_PntStruc = new msgPointStruct();
//////////                msgSplineStruct lo_close_spline_struct = msgSplineStruct.Create();


//////////                int lv_i = 0;

//////////                for (lv_i = 0; lv_i <= lv_double_num_points; lv_i++)
//////////                {
//////////                    if (lv_i < lv_numPoints + 1)
//////////                    {
//////////                        ls_PntStruc = equiContour1.GetPointFromCoefficient(lv_i / (double)lv_numPoints);
//////////                        ls_PntStruc.z = 0;
//////////                        lo_close_spline_struct.AddKnot(ls_PntStruc, lv_i);
//////////                    }
//////////                    else
//////////                    {
//////////                        ls_PntStruc = equiContour2.GetPointFromCoefficient((lv_i - (lv_numPoints + 1)) / (double)lv_numPoints);
//////////                        ls_PntStruc.z = 0;
//////////                        lo_close_spline_struct.AddKnot(ls_PntStruc, lv_i);
//////////                    }

//////////                }

//////////                ls_PntStruc = equiContour1.GetPointFromCoefficient(0);
//////////                ls_PntStruc.z = 0;
//////////                lo_close_spline_struct.AddKnot(ls_PntStruc, lv_double_num_points + 1);

//////////                lo_close_spline_struct.Close();


//////////                msgSpline lo_close_spline = msgSpline.Create(lo_close_spline_struct);

//////////                bool lv_is = lo_close_spline.IsClosed();


//////////                //msgObject[] contour_objcts = new msgObject[4];
//////////                //contour_objcts[0] = equiContour1;
//////////                //contour_objcts[1] = equiContour2;
//////////                //msgContour lo_common_countour = msgContour.CreateContour(contour_objcts);

//////////                msgVectorStruct lo_EquiExtrudeVector = new msgVectorStruct(0, 0, 5);//052024



//////////                //msg3DObject lo_original_spline_extruded = (msg3DObject)msgKinematic.Extrude(lo_original_spline, null, lo_EquiExtrudeVector, true);
//////////                //po_scene.AttachObject(lo_original_spline_extruded);//01062024 отладка!! Потом убрать! 


//////////                msg3DObject lo_Equidistan_contour_extruded1 = (msg3DObject)msgKinematic.Extrude(equiContour1, null, lo_EquiExtrudeVector, true);
//////////                msg3DObject lo_Equidistan_contour_extruded2 = (msg3DObject)msgKinematic.Extrude(equiContour2, null, lo_EquiExtrudeVector, true);
//////////                po_scene.AttachObject(lo_Equidistan_contour_extruded1);
//////////                po_scene.AttachObject(lo_Equidistan_contour_extruded2);


//////////                //msg3DObject lo_close_spline_extruded = (msg3DObject)msgKinematic.Extrude(lo_close_spline, null, lo_EquiExtrudeVector, true);// error!
//////////                // error!

//////////                //po_scene.AttachObject(lo_close_spline_extruded);

//////////                //result = lo_close_spline_extruded;

//////////                break;

//////////        }
//////////        return result;

//////////    }

//////////    //--------------------------------------------------------------------------------------------------
//////////    private static void do_sub(msgScene po_scene, msg3DObject po_minuend, msg3DObject po_subtrahend)
//////////    {
//////////        msgGroup lo_bool_result = null;

//////////        lo_bool_result = msgBoolean.Sub(po_minuend, po_subtrahend);

//////////        msgObject[] lar_parts = null;

//////////        lo_bool_result.BreakGroup(ref lar_parts);
//////////        for (int icurr = 0; icurr < lar_parts.Length; icurr++)
//////////        {
//////////            po_scene.AttachObject(lar_parts[icurr]);
//////////        }

//////////    }
//////////    //--------------------------------------------------------------------------------------------------

//////////    static void EndWork(msgScene po_scene)
//////////    {
//////////        string lv_path_to_export = Path.Combine(Environment.CurrentDirectory, @"test_data/testResult.stl");
//////////        msgFileManager.ExportSTL(po_scene, lv_path_to_export);

//////////        msgCore.FreeKernel(false);
//////////    }

//////////}
////////////==========================================================================================================






