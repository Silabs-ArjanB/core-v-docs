var g_data = {"name":"/shark0/processing/cv32e40p/users/processing/PRODUCTS_DIGITAL_DESIGN/PANTHER/PANTHER_1.0/CV32/NR/CFG_P_F0/NR_QUESTA_INT_DEBUG_LONG/workdir/core-v-cores/cv32e40p/rtl/vendor/pulp_platform_fpnew/src/fpnew_opgroup_fmt_slice.sv","src":"// Copyright 2019 ETH Zurich and University of Bologna.\n//\n// Copyright and related rights are licensed under the Solderpad Hardware\n// License, Version 0.51 (the \"License\"); you may not use this file except in\n// compliance with the License. You may obtain a copy of the License at\n// http://solderpad.org/licenses/SHL-0.51. Unless required by applicable law\n// or agreed to in writing, software, hardware and materials distributed under\n// this License is distributed on an \"AS IS\" BASIS, WITHOUT WARRANTIES OR\n// CONDITIONS OF ANY KIND, either express or implied. See the License for the\n// specific language governing permissions and limitations under the License.\n//\n// SPDX-License-Identifier: SHL-0.51\n\n// Author: Stefan Mach <smach@iis.ee.ethz.ch>\n\nmodule fpnew_opgroup_fmt_slice #(\n  parameter fpnew_pkg::opgroup_e     OpGroup       = fpnew_pkg::ADDMUL,\n  parameter fpnew_pkg::fp_format_e   FpFormat      = fpnew_pkg::fp_format_e'(0),\n  // FPU configuration\n  parameter int unsigned             Width         = 32,\n  parameter logic                    EnableVectors = 1'b1,\n  parameter int unsigned             NumPipeRegs   = 0,\n  parameter fpnew_pkg::pipe_config_t PipeConfig    = fpnew_pkg::BEFORE,\n  parameter logic                    ExtRegEna     = 1'b0,\n  parameter type                     TagType       = logic,\n  parameter int unsigned             TrueSIMDClass = 0,\n  // Do not change\n  localparam int unsigned NUM_OPERANDS = fpnew_pkg::num_operands(OpGroup),\n  localparam int unsigned NUM_LANES    = fpnew_pkg::num_lanes(Width, FpFormat, EnableVectors),\n  localparam type         MaskType     = logic [NUM_LANES-1:0],\n  localparam int unsigned ExtRegEnaWidth = NumPipeRegs == 0 ? 1 : NumPipeRegs\n) (\n  input logic                               clk_i,\n  input logic                               rst_ni,\n  // Input signals\n  input logic [NUM_OPERANDS-1:0][Width-1:0] operands_i,\n  input logic [NUM_OPERANDS-1:0]            is_boxed_i,\n  input fpnew_pkg::roundmode_e              rnd_mode_i,\n  input fpnew_pkg::operation_e              op_i,\n  input logic                               op_mod_i,\n  input logic                               vectorial_op_i,\n  input TagType                             tag_i,\n  input MaskType                            simd_mask_i,\n  // Input Handshake\n  input  logic                              in_valid_i,\n  output logic                              in_ready_o,\n  input  logic                              flush_i,\n  // Output signals\n  output logic [Width-1:0]                  result_o,\n  output fpnew_pkg::status_t                status_o,\n  output logic                              extension_bit_o,\n  output TagType                            tag_o,\n  // Output handshake\n  output logic                              out_valid_o,\n  input  logic                              out_ready_i,\n  // Indication of valid data in flight\n  output logic                              busy_o,\n  // External register enable override\n  input  logic [ExtRegEnaWidth-1:0]         reg_ena_i\n);\n\n  localparam int unsigned FP_WIDTH  = fpnew_pkg::fp_width(FpFormat);\n  localparam int unsigned SIMD_WIDTH = unsigned'(Width/NUM_LANES);\n\n\n  logic [NUM_LANES-1:0] lane_in_ready, lane_out_valid; // Handshake signals for the lanes\n  logic                 vectorial_op;\n\n  logic [NUM_LANES*FP_WIDTH-1:0] slice_result;\n  logic [Width-1:0]              slice_regular_result, slice_class_result, slice_vec_class_result;\n\n  fpnew_pkg::status_t    [NUM_LANES-1:0] lane_status;\n  logic                  [NUM_LANES-1:0] lane_ext_bit; // only the first one is actually used\n  fpnew_pkg::classmask_e [NUM_LANES-1:0] lane_class_mask;\n  TagType                [NUM_LANES-1:0] lane_tags; // only the first one is actually used\n  logic                  [NUM_LANES-1:0] lane_masks;\n  logic                  [NUM_LANES-1:0] lane_vectorial, lane_busy, lane_is_class; // dito\n\n  logic result_is_vector, result_is_class;\n\n  // -----------\n  // Input Side\n  // -----------\n  assign in_ready_o   = lane_in_ready[0]; // Upstream ready is given by first lane\n  assign vectorial_op = vectorial_op_i & EnableVectors; // only do vectorial stuff if enabled\n\n  // ---------------\n  // Generate Lanes\n  // ---------------\n  for (genvar lane = 0; lane < int'(NUM_LANES); lane++) begin : gen_num_lanes\n    logic [FP_WIDTH-1:0] local_result; // lane-local results\n    logic                local_sign;\n\n    // Generate instances only if needed, lane 0 always generated\n    if ((lane == 0) || EnableVectors) begin : active_lane\n      logic in_valid, out_valid, out_ready; // lane-local handshake\n\n      logic [NUM_OPERANDS-1:0][FP_WIDTH-1:0] local_operands; // lane-local operands\n      logic [FP_WIDTH-1:0]                   op_result;      // lane-local results\n      fpnew_pkg::status_t                    op_status;\n\n      assign in_valid = in_valid_i & ((lane == 0) | vectorial_op); // upper lanes only for vectors\n      // Slice out the operands for this lane\n      always_comb begin : prepare_input\n        for (int i = 0; i < int'(NUM_OPERANDS); i++) begin\n          local_operands[i] = operands_i[i][(unsigned'(lane)+1)*FP_WIDTH-1:unsigned'(lane)*FP_WIDTH];\n        end\n      end\n\n      // Instantiate the operation from the selected opgroup\n      if (OpGroup == fpnew_pkg::ADDMUL) begin : lane_instance\n        fpnew_fma #(\n          .FpFormat    ( FpFormat    ),\n          .NumPipeRegs ( NumPipeRegs ),\n          .PipeConfig  ( PipeConfig  ),\n          .TagType     ( TagType     ),\n          .AuxType     ( logic       )\n        ) i_fma (\n          .clk_i,\n          .rst_ni,\n          .operands_i      ( local_operands               ),\n          .is_boxed_i      ( is_boxed_i[NUM_OPERANDS-1:0] ),\n          .rnd_mode_i,\n          .op_i,\n          .op_mod_i,\n          .tag_i,\n          .mask_i          ( simd_mask_i[lane]    ),\n          .aux_i           ( vectorial_op         ), // Remember whether operation was vectorial\n          .in_valid_i      ( in_valid             ),\n          .in_ready_o      ( lane_in_ready[lane]  ),\n          .flush_i,\n          .result_o        ( op_result            ),\n          .status_o        ( op_status            ),\n          .extension_bit_o ( lane_ext_bit[lane]   ),\n          .tag_o           ( lane_tags[lane]      ),\n          .mask_o          ( lane_masks[lane]     ),\n          .aux_o           ( lane_vectorial[lane] ),\n          .out_valid_o     ( out_valid            ),\n          .out_ready_i     ( out_ready            ),\n          .busy_o          ( lane_busy[lane]      ),\n          .reg_ena_i\n        );\n        assign lane_is_class[lane]   = 1'b0;\n        assign lane_class_mask[lane] = fpnew_pkg::NEGINF;\n      end else if (OpGroup == fpnew_pkg::DIVSQRT) begin : lane_instance\n        // fpnew_divsqrt #(\n        //   .FpFormat   (FpFormat),\n        //   .NumPipeRegs(NumPipeRegs),\n        //   .PipeConfig (PipeConfig),\n        //   .TagType    (TagType),\n        //   .AuxType    (logic)\n        // ) i_divsqrt (\n        //   .clk_i,\n        //   .rst_ni,\n        //   .operands_i      ( local_operands               ),\n        //   .is_boxed_i      ( is_boxed_i[NUM_OPERANDS-1:0] ),\n        //   .rnd_mode_i,\n        //   .op_i,\n        //   .op_mod_i,\n        //   .tag_i,\n        //   .aux_i           ( vectorial_op         ), // Remember whether operation was vectorial\n        //   .in_valid_i      ( in_valid             ),\n        //   .in_ready_o      ( lane_in_ready[lane]  ),\n        //   .flush_i,\n        //   .result_o        ( op_result            ),\n        //   .status_o        ( op_status            ),\n        //   .extension_bit_o ( lane_ext_bit[lane]   ),\n        //   .tag_o           ( lane_tags[lane]      ),\n        //   .aux_o           ( lane_vectorial[lane] ),\n        //   .out_valid_o     ( out_valid            ),\n        //   .out_ready_i     ( out_ready            ),\n        //   .busy_o          ( lane_busy[lane]      ),\n        //   .reg_ena_i\n        // );\n        // assign lane_is_class[lane] = 1'b0;\n      end else if (OpGroup == fpnew_pkg::NONCOMP) begin : lane_instance\n        fpnew_noncomp #(\n          .FpFormat   (FpFormat),\n          .NumPipeRegs(NumPipeRegs),\n          .PipeConfig (PipeConfig),\n          .TagType    (TagType),\n          .AuxType    (logic)\n        ) i_noncomp (\n          .clk_i,\n          .rst_ni,\n          .operands_i      ( local_operands               ),\n          .is_boxed_i      ( is_boxed_i[NUM_OPERANDS-1:0] ),\n          .rnd_mode_i,\n          .op_i,\n          .op_mod_i,\n          .tag_i,\n          .mask_i          ( simd_mask_i[lane]     ),\n          .aux_i           ( vectorial_op          ), // Remember whether operation was vectorial\n          .in_valid_i      ( in_valid              ),\n          .in_ready_o      ( lane_in_ready[lane]   ),\n          .flush_i,\n          .result_o        ( op_result             ),\n          .status_o        ( op_status             ),\n          .extension_bit_o ( lane_ext_bit[lane]    ),\n          .class_mask_o    ( lane_class_mask[lane] ),\n          .is_class_o      ( lane_is_class[lane]   ),\n          .tag_o           ( lane_tags[lane]       ),\n          .mask_o          ( lane_masks[lane]      ),\n          .aux_o           ( lane_vectorial[lane]  ),\n          .out_valid_o     ( out_valid             ),\n          .out_ready_i     ( out_ready             ),\n          .busy_o          ( lane_busy[lane]       ),\n          .reg_ena_i\n        );\n      end // ADD OTHER OPTIONS HERE\n\n      // Handshakes are only done if the lane is actually used\n      assign out_ready            = out_ready_i & ((lane == 0) | result_is_vector);\n      assign lane_out_valid[lane] = out_valid   & ((lane == 0) | result_is_vector);\n\n      // Properly NaN-box or sign-extend the slice result if not in use\n      assign local_result      = (lane_out_valid[lane] | ExtRegEna) ? op_result : '{default: lane_ext_bit[0]};\n      assign lane_status[lane] = (lane_out_valid[lane] | ExtRegEna) ? op_status : '0;\n\n    // Otherwise generate constant sign-extension\n    end else begin\n      assign lane_out_valid[lane] = 1'b0; // unused lane\n      assign lane_in_ready[lane]  = 1'b0; // unused lane\n      assign local_result         = '{default: lane_ext_bit[0]}; // sign-extend/nan box\n      assign lane_status[lane]    = '0;\n      assign lane_busy[lane]      = 1'b0;\n      assign lane_is_class[lane]  = 1'b0;\n    end\n\n    // Insert lane result into slice result\n    assign slice_result[(unsigned'(lane)+1)*FP_WIDTH-1:unsigned'(lane)*FP_WIDTH] = local_result;\n\n    // Create Classification results\n    if (TrueSIMDClass && SIMD_WIDTH >= 10) begin : vectorial_true_class // true vectorial class blocks are 10bits in size\n      assign slice_vec_class_result[lane*SIMD_WIDTH +: 10] = lane_class_mask[lane];\n      assign slice_vec_class_result[(lane+1)*SIMD_WIDTH-1 -: SIMD_WIDTH-10] = '0;\n    end else if ((lane+1)*8 <= Width) begin : vectorial_class // vectorial class blocks are 8bits in size\n      assign local_sign = (lane_class_mask[lane] == fpnew_pkg::NEGINF ||\n                           lane_class_mask[lane] == fpnew_pkg::NEGNORM ||\n                           lane_class_mask[lane] == fpnew_pkg::NEGSUBNORM ||\n                           lane_class_mask[lane] == fpnew_pkg::NEGZERO);\n      // Write the current block segment\n      assign slice_vec_class_result[(lane+1)*8-1:lane*8] = {\n        local_sign,  // BIT 7\n        ~local_sign, // BIT 6\n        lane_class_mask[lane] == fpnew_pkg::QNAN, // BIT 5\n        lane_class_mask[lane] == fpnew_pkg::SNAN, // BIT 4\n        lane_class_mask[lane] == fpnew_pkg::POSZERO\n            || lane_class_mask[lane] == fpnew_pkg::NEGZERO, // BIT 3\n        lane_class_mask[lane] == fpnew_pkg::POSSUBNORM\n            || lane_class_mask[lane] == fpnew_pkg::NEGSUBNORM, // BIT 2\n        lane_class_mask[lane] == fpnew_pkg::POSNORM\n            || lane_class_mask[lane] == fpnew_pkg::NEGNORM, // BIT 1\n        lane_class_mask[lane] == fpnew_pkg::POSINF\n            || lane_class_mask[lane] == fpnew_pkg::NEGINF // BIT 0\n      };\n    end\n  end\n\n  // ------------\n  // Output Side\n  // ------------\n  assign result_is_vector = lane_vectorial[0];\n  assign result_is_class  = lane_is_class[0];\n\n  assign slice_regular_result = $signed({extension_bit_o, slice_result});\n\n  localparam int unsigned CLASS_VEC_BITS = (NUM_LANES*8 > Width) ? 8 * (Width / 8) : NUM_LANES*8;\n\n  // Pad out unused vec_class bits if each classify result is on 8 bits\n  if (!(TrueSIMDClass && SIMD_WIDTH >= 10)) begin\n    if (CLASS_VEC_BITS < Width) begin : pad_vectorial_class\n      assign slice_vec_class_result[Width-1:CLASS_VEC_BITS] = '0;\n    end\n  end\n\n  // localparam logic [Width-1:0] CLASS_VEC_MASK = 2**CLASS_VEC_BITS - 1;\n\n  assign slice_class_result = result_is_vector ? slice_vec_class_result : lane_class_mask[0];\n\n  // Select the proper result\n  assign result_o = result_is_class ? slice_class_result : slice_regular_result;\n\n  assign extension_bit_o                              = lane_ext_bit[0]; // upper lanes unused\n  assign tag_o                                        = lane_tags[0];    // upper lanes unused\n  assign busy_o                                       = (| lane_busy);\n  assign out_valid_o                                  = lane_out_valid[0]; // upper lanes unused\n\n\n  // Collapse the lane status\n  always_comb begin : output_processing\n    // Collapse the status\n    automatic fpnew_pkg::status_t temp_status;\n    temp_status = '0;\n    for (int i = 0; i < int'(NUM_LANES); i++)\n      temp_status |= lane_status[i] & {5{lane_masks[i]}};\n    status_o = temp_status;\n  end\nendmodule\n","lang":"verilog"};
processSrcData(g_data);