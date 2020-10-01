import { createConnection } from "../../core/network/command/ConnectionCommand";
import { createContainer } from "../../core/network/command/ContainerCommand";
import { createContainerInstance } from "../../core/network/command/ContainerInstanceCommand";
import { createServer } from "../../core/network/command/ServerCommand";
import { createSoftwareSystem } from "../../core/network/command/SoftwareSystemCommand";

export const ss_docgen = createSoftwareSystem("Document Generation", "");
export const ss_doccapt = createSoftwareSystem("Document Capture", "");

export const container1 = createContainer("Container", "", ss_docgen.id);
export const container2 = createContainer("Container2", "", ss_docgen.id);
export const container3 = createContainer("Container3", "", ss_doccapt.id);

export const con1 = createConnection("con1", ss_docgen.id, ss_doccapt.id);
export const con2 = createConnection("con2", ss_docgen.id, container3.id);
export const con3 = createConnection("con3", container1.id, ss_doccapt.id);

export const server_tst = createServer("Server 1", "", "TST");
export const server_acc = createServer("sv2", "First server", "ACC");
export const server_nosegment = createServer("sv3", "");
export const server2_tst = createServer("sv4", "", "TST");

export const cont_inst = createContainerInstance("ci1", server_tst.id.id);
export const cont_inst2 = createContainerInstance("ci2", server_tst.id.id);
