interface TodoItem {
  title: string;
  check?: boolean;
}

const baseData: TodoItem[] = [
  { title: "融合知识图谱的文本异构信息网络构建以及在机器学习中的应用" },
  { title: "金融反欺诈中，社交网络算法有用吗？" },
  { title: "用动态自服务的队列和容量管理来帮助用户" },
  { title: "Twitter实时计算平台" },
  { title: "周六欢迎致辞" },
  { title: "Big data, big value" },
  { title: "基于大数据的人工智能应用" },
  { title: "大数据分析，不再是工程师的禁脔！" },
  { title: "从大数据到大价值的道路" },
  { title: "数据如何驱动增长" },
  { title: "Better data, better finance" },
  { title: "结束致辞" },
  { title: "通告及介绍" },
  { title: "Spark 2.0及其下一步发展" },
  { title: "小米大数据和黑科技" },
  { title: "互联网+制造：在物联和数据时代的创新和引领" },
  { title: "结束致辞" },
  { title: "小米数据平台的实践" },
  { title: "滴滴出行实时计算系统架构及实践" },
  { title: "针对大规模机器/深度学习的分布式参数服务器" },
  { title: "大学习时代：应对大数据和大模型的挑战" },
  { title: "YARN集群上的分布式深度学习" },
  { title: "构建基于Apache Kylin的大数据分析平台" },
  { title: "Spark和YARN：最好一起工作" },
  { title: "HDFS erasure coding: 一半的成本，更快的速度" },
  { title: "基于Mesos DCOS的大数据云计算平台架构" },
  { title: "基于Kafka以及Spark Streaming的高扩展性数据质量保证平台" },
  { title: "工业大数据系统及其应用实践" },
  { title: "基于Druid和Drill的OLAP引擎" },
  { title: "Druid: 助力大规模交互式应用" },
  { title: "Alluxio帮助去哪儿网酒店数据业务最高提速300x" },
  { title: "Spark中结构化流计算的深度介绍" },
  { title: "深度学习在Spark平台上进入生产环境" },
  { title: "Apache Kylin的Streaming OLAP实现" },
  { title: "如何高效高质低成本构建和管理大数据研发体系？" },
  { title: "无人机— 海量数据的新领域" },
  { title: "周六午餐时间的行业桌会" }
];

let testData: TodoItem[] = [];
let count = 100;

do {
  testData = testData.concat(baseData);
  count--;
} while (count > 0);

console.log("data len: " + testData.length);

export default testData;
