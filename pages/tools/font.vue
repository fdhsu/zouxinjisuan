<template>
	<view class="page">
		<!-- Tab Bar -->
		<view class="tab-bar">
			<view
				class="tab-item"
				:class="{ active: currentTab === index }"
				v-for="(tab, index) in tabs"
				:key="index"
				@tap="currentTab = index"
			>
				<text>{{ tab }}</text>
			</view>
		</view>

		<!-- Tab 0: Text Conversion -->
		<view class="tab-content" v-if="currentTab === 0">
			<!-- Direction Selector -->
			<view class="card">
				<view class="section-label">转换方向</view>
				<view class="seg-control">
					<view
						class="seg-item"
						:class="{ active: directionIndex === idx }"
						v-for="(d, idx) in directions"
						:key="idx"
						@tap="directionIndex = idx"
					>
						<text class="seg-text">{{ d }}</text>
					</view>
				</view>
			</view>

			<!-- Input Area -->
			<view class="card">
				<view class="section-header">
					<text class="section-title">输入文本</text>
					<text class="word-count">{{ inputStats.total }} 字</text>
				</view>
				<textarea
					class="text-area"
					v-model="inputText"
					placeholder="请输入要转换的文本内容..."
					:auto-height="false"
					:maxlength="-1"
				/>
				<view class="stats-row" v-if="inputText">
					<text>中文 {{ inputStats.chinese }}</text>
					<text>英文 {{ inputStats.english }}</text>
					<text>标点 {{ inputStats.punctuation }}</text>
					<text>段落 {{ inputStats.paragraphs }}</text>
				</view>
			</view>

			<!-- Action Buttons -->
			<view class="action-row">
				<view class="act-btn primary" @tap="doConvert"><text class="act-btn-text">转换</text></view>
				<view class="act-btn" @tap="doSwap"><text class="act-btn-text">互换</text></view>
				<view class="act-btn" @tap="doSample"><text class="act-btn-text">示例</text></view>
				<view class="act-btn danger" @tap="doClear"><text class="act-btn-text">清空</text></view>
			</view>

			<!-- Output Area -->
			<view class="card">
				<view class="section-header">
					<text class="section-title">转换结果</text>
					<text class="word-count">{{ outputText.length }} 字</text>
				</view>
				<view class="output-area" v-if="outputText">
					<text class="output-text" selectable>{{ outputText }}</text>
				</view>
				<view class="output-area empty-output" v-else>
					<text class="placeholder-text">转换结果将显示在这里</text>
				</view>
				<view class="stats-row" v-if="outputText">
					<text>中文 {{ outputStats.chinese }}</text>
					<text>英文 {{ outputStats.english }}</text>
					<text>标点 {{ outputStats.punctuation }}</text>
					<text>段落 {{ outputStats.paragraphs }}</text>
				</view>
				<view class="action-row inner" v-if="outputText">
					<view class="act-btn primary" @tap="copyText(outputText)"><text class="act-btn-text">复制结果</text></view>
				</view>
			</view>
		</view>

		<!-- Tab 1: Comparison Table -->
		<view class="tab-content" v-if="currentTab === 1">
			<view class="card">
				<view class="toggle-row">
					<text class="toggle-label">显示方向</text>
					<view class="toggle-group">
						<view class="toggle-btn" :class="{ active: showDirection === 's2t' }" @tap="showDirection = 's2t'">
							<text>简 → 繁</text>
						</view>
						<view class="toggle-btn" :class="{ active: showDirection === 't2s' }" @tap="showDirection = 't2s'">
							<text>繁 → 简</text>
						</view>
					</view>
				</view>
				<view class="search-bar">
					<input class="search-input" v-model="searchQuery" placeholder="搜索繁简对照（输入汉字）" />
				</view>
			</view>

			<view class="card">
				<scroll-view scroll-x class="cat-scroll">
					<view class="cat-list">
						<view
							class="cat-tag"
							:class="{ active: activeCategory === 'radical' }"
							@tap="activeCategory = 'radical'"
						><text>部首不同</text></view>
						<view
							class="cat-tag"
							:class="{ active: activeCategory === 'structure' }"
							@tap="activeCategory = 'structure'"
						><text>结构变化</text></view>
						<view
							class="cat-tag"
							:class="{ active: activeCategory === 'replace' }"
							@tap="activeCategory = 'replace'"
						><text>完全替换</text></view>
					</view>
				</scroll-view>
			</view>

			<view class="compare-grid">
				<view class="compare-card" v-for="(item, idx) in filteredPairs" :key="idx">
					<view class="pair-row">
						<view class="pair-char primary-char">
							<text>{{ showDirection === 's2t' ? item.s : item.t }}</text>
						</view>
						<text class="pair-arrow">→</text>
						<view class="pair-char secondary-char">
							<text>{{ showDirection === 's2t' ? item.t : item.s }}</text>
						</view>
					</view>
					<text class="pair-pinyin">{{ item.py }}</text>
				</view>
			</view>

			<view class="empty-state" v-if="filteredPairs.length === 0">
				<text>未找到匹配的繁简对照</text>
			</view>
		</view>

		<!-- Tab 2: Custom Dictionary -->
		<view class="tab-content" v-if="currentTab === 2">
			<view class="card">
				<view class="toggle-row">
					<text class="toggle-label">转换时应用自定义词库</text>
					<u-switch v-model="useCustomDict" activeColor="#2B7DE9" inactiveColor="#d0d0d0" size="44" />
				</view>
			</view>

			<view class="card">
				<text class="section-title">添加词条</text>
				<view class="form-group">
					<input class="form-input" v-model="newEntry.simplified" placeholder="简体词" />
				</view>
				<view class="form-group">
					<input class="form-input" v-model="newEntry.traditional" placeholder="繁体词" />
				</view>
				<view class="form-group">
					<picker :range="categoryOptions" :range-key="'label'" :value="categoryPickerIndex" @change="onCategoryPick">
						<view class="form-picker">
							<text :class="{ 'picker-placeholder': !newEntry.category }">
								{{ newEntry.category || '选择分类' }}
							</text>
							<text class="picker-arrow">▼</text>
						</view>
					</picker>
				</view>
				<view class="action-row">
					<view class="act-btn primary" @tap="addEntry"><text class="act-btn-text">添加</text></view>
				</view>
			</view>

			<view class="card">
				<scroll-view scroll-x class="cat-scroll">
					<view class="cat-list">
						<view
							class="cat-tag"
							:class="{ active: dictFilter === 'all' }"
							@tap="dictFilter = 'all'"
						><text>全部 ({{ customDict.length }})</text></view>
						<view
							class="cat-tag"
							:class="{ active: dictFilter === cat.value }"
							v-for="cat in categoryOptions"
							:key="cat.value"
						><text>{{ cat.label }} ({{ countByCategory(cat.value) }})</text></view>
					</view>
				</scroll-view>

				<view class="dict-list" v-if="filteredDict.length > 0">
					<view class="dict-item" v-for="(item, idx) in filteredDict" :key="idx">
						<view class="dict-info">
							<text class="dict-word">{{ item.simplified }}</text>
							<text class="dict-arrow">→</text>
							<text class="dict-word">{{ item.traditional }}</text>
							<text class="dict-cat-tag">{{ getCategoryLabel(item.category) }}</text>
						</view>
						<view class="dict-del" @tap="removeEntry(idx)"><text class="del-text">删除</text></view>
					</view>
				</view>
				<view class="empty-state" v-else>
					<text>暂无词条，请添加或导入预置词库</text>
				</view>
			</view>

			<view class="card">
				<text class="section-title">预置专业词库</text>
				<text class="section-desc">点击一键导入专业术语对照</text>
				<view class="preset-list">
					<view class="preset-item" v-for="(preset, key) in presetDicts" :key="key">
						<view class="preset-info">
							<text class="preset-name">{{ preset.name }}</text>
							<text class="preset-count">{{ preset.data.length }} 条</text>
						</view>
						<view class="preset-btn" @tap="importPreset(key)"><text class="preset-btn-text">导入</text></view>
					</view>
				</view>
			</view>
		</view>

		<!-- Tab 3: History -->
		<view class="tab-content" v-if="currentTab === 3">
			<view class="card" v-if="history.length > 0">
				<view class="section-header">
					<text class="section-title">转换历史</text>
					<text class="clear-text" @tap="clearHistory">清空全部</text>
				</view>
			</view>

			<view
				class="card history-card"
				v-for="(item, idx) in history"
				:key="idx"
				@tap="toggleHistory(idx)"
			>
				<view class="history-header">
					<text class="history-time">{{ item.time }}</text>
					<text class="history-dir-tag">{{ item.direction }}</text>
				</view>
				<view class="history-preview">
					<view class="preview-line">
						<text class="preview-label">输入：</text>
						<text class="preview-value">{{ item.inputPreview }}</text>
					</view>
					<view class="preview-line">
						<text class="preview-label">输出：</text>
						<text class="preview-value">{{ item.outputPreview }}</text>
					</view>
				</view>
				<view class="history-detail" v-if="expandedHistory === idx">
					<view class="detail-block">
						<text class="detail-label">完整输入</text>
						<text class="detail-text" selectable>{{ item.inputFull }}</text>
					</view>
					<view class="detail-block">
						<text class="detail-label">完整输出</text>
						<text class="detail-text" selectable>{{ item.outputFull }}</text>
					</view>
					<view class="action-row">
						<view class="act-btn primary" @tap.stop="copyText(item.outputFull)">
							<text class="act-btn-text">复制输出</text>
						</view>
					</view>
				</view>
			</view>

			<view class="empty-state" v-if="history.length === 0">
				<text>暂无转换历史</text>
			</view>
		</view>
	</view>
</template>

<script>
import * as opencc from 'opencc-js';
import { formatDateTime } from '@/utils/helpers.js';

export default {
	data() {
		return {
			tabs: ['文本转换', '繁简对照', '自定义词库', '转换历史'],
			currentTab: 0,
			directions: [
				'简体 → 繁体（台湾）',
				'简体 → 繁体（香港）',
				'简体 → 繁体（通用）',
				'繁体（台湾）→ 简体',
				'繁体（香港）→ 简体',
				'繁体（通用）→ 简体'
			],
			directionIndex: 0,
			inputText: '',
			outputText: '',
			useCustomDict: true,
			showDirection: 's2t',
			searchQuery: '',
			activeCategory: 'radical',
			newEntry: { simplified: '', traditional: '', category: '' },
			dictFilter: 'all',
			customDict: [],
			history: [],
			expandedHistory: -1,
			categoryOptions: [
				{ label: '医学', value: 'medical' },
				{ label: '法律', value: 'law' },
				{ label: '科技', value: 'tech' },
				{ label: '古籍', value: 'classic' },
				{ label: '自定义', value: 'custom' }
			],
			presetDicts: {
				medical: {
					name: '医学常用词',
					data: [
						{ simplified: '手术', traditional: '手術', category: 'medical' },
						{ simplified: '病历', traditional: '病歷', category: 'medical' },
						{ simplified: '门诊', traditional: '門診', category: 'medical' },
						{ simplified: '临床', traditional: '臨床', category: 'medical' },
						{ simplified: '处方', traditional: '處方', category: 'medical' },
						{ simplified: '诊断', traditional: '診斷', category: 'medical' },
						{ simplified: '治疗', traditional: '治療', category: 'medical' },
						{ simplified: '肿瘤', traditional: '腫瘤', category: 'medical' },
						{ simplified: '病毒', traditional: '病毒', category: 'medical' },
						{ simplified: '免疫', traditional: '免疫', category: 'medical' }
					]
				},
				law: {
					name: '法律常用词',
					data: [
						{ simplified: '宪法', traditional: '憲法', category: 'law' },
						{ simplified: '刑法', traditional: '刑法', category: 'law' },
						{ simplified: '民法', traditional: '民法', category: 'law' },
						{ simplified: '诉讼', traditional: '訴訟', category: 'law' },
						{ simplified: '辩护', traditional: '辯護', category: 'law' },
						{ simplified: '判决', traditional: '判決', category: 'law' },
						{ simplified: '仲裁', traditional: '仲裁', category: 'law' },
						{ simplified: '法规', traditional: '法規', category: 'law' },
						{ simplified: '权利', traditional: '權利', category: 'law' },
						{ simplified: '义务', traditional: '義務', category: 'law' }
					]
				},
				tech: {
					name: '科技常用词',
					data: [
						{ simplified: '电脑', traditional: '電腦', category: 'tech' },
						{ simplified: '软件', traditional: '軟體', category: 'tech' },
						{ simplified: '网络', traditional: '網路', category: 'tech' },
						{ simplified: '数据', traditional: '數據', category: 'tech' },
						{ simplified: '算法', traditional: '算法', category: 'tech' },
						{ simplified: '编程', traditional: '編程', category: 'tech' },
						{ simplified: '服务器', traditional: '伺服器', category: 'tech' },
						{ simplified: '数据库', traditional: '資料庫', category: 'tech' },
						{ simplified: '人工智能', traditional: '人工智慧', category: 'tech' },
						{ simplified: '云计算', traditional: '雲端運算', category: 'tech' }
					]
				}
			},
			comparisonData: {
				radical: [
					{ t: '語', s: '语', py: 'yǔ' },
					{ t: '話', s: '话', py: 'huà' },
					{ t: '計', s: '计', py: 'jì' },
					{ t: '說', s: '说', py: 'shuō' },
					{ t: '讀', s: '读', py: 'dú' },
					{ t: '論', s: '论', py: 'lùn' },
					{ t: '議', s: '议', py: 'yì' },
					{ t: '記', s: '记', py: 'jì' },
					{ t: '許', s: '许', py: 'xǔ' },
					{ t: '評', s: '评', py: 'píng' },
					{ t: '詞', s: '词', py: 'cí' },
					{ t: '認', s: '认', py: 'rèn' },
					{ t: '識', s: '识', py: 'shí' },
					{ t: '讓', s: '让', py: 'ràng' },
					{ t: '請', s: '请', py: 'qǐng' },
					{ t: '買', s: '买', py: 'mǎi' },
					{ t: '賣', s: '卖', py: 'mài' },
					{ t: '貴', s: '贵', py: 'guì' },
					{ t: '費', s: '费', py: 'fèi' },
					{ t: '資', s: '资', py: 'zī' },
					{ t: '賞', s: '赏', py: 'shǎng' },
					{ t: '賢', s: '贤', py: 'xián' },
					{ t: '貝', s: '贝', py: 'bèi' },
					{ t: '見', s: '见', py: 'jiàn' },
					{ t: '觀', s: '观', py: 'guān' },
					{ t: '視', s: '视', py: 'shì' },
					{ t: '覺', s: '觉', py: 'jué' },
					{ t: '規', s: '规', py: 'guī' },
					{ t: '鐵', s: '铁', py: 'tiě' },
					{ t: '銀', s: '银', py: 'yín' },
					{ t: '銅', s: '铜', py: 'tóng' },
					{ t: '鋼', s: '钢', py: 'gāng' },
					{ t: '錢', s: '钱', py: 'qián' },
					{ t: '門', s: '门', py: 'mén' },
					{ t: '問', s: '问', py: 'wèn' },
					{ t: '間', s: '间', py: 'jiān' },
					{ t: '開', s: '开', py: 'kāi' },
					{ t: '關', s: '关', py: 'guān' },
					{ t: '馬', s: '马', py: 'mǎ' },
					{ t: '驗', s: '验', py: 'yàn' },
					{ t: '騎', s: '骑', py: 'qí' },
					{ t: '魚', s: '鱼', py: 'yú' },
					{ t: '鮮', s: '鲜', py: 'xiān' },
					{ t: '鳥', s: '鸟', py: 'niǎo' },
					{ t: '雞', s: '鸡', py: 'jī' },
					{ t: '鴨', s: '鸭', py: 'yā' },
					{ t: '車', s: '车', py: 'chē' },
					{ t: '輪', s: '轮', py: 'lún' },
					{ t: '輛', s: '辆', py: 'liàng' },
					{ t: '飯', s: '饭', py: 'fàn' },
					{ t: '飲', s: '饮', py: 'yǐn' },
					{ t: '頁', s: '页', py: 'yè' },
					{ t: '題', s: '题', py: 'tí' },
					{ t: '領', s: '领', py: 'lǐng' },
					{ t: '鄧', s: '邓', py: 'dèng' },
					{ t: '鄭', s: '郑', py: 'zhèng' },
					{ t: '鄰', s: '邻', py: 'lín' },
					{ t: '紅', s: '红', py: 'hóng' },
					{ t: '線', s: '线', py: 'xiàn' },
					{ t: '組', s: '组', py: 'zǔ' },
					{ t: '結', s: '结', py: 'jié' },
					{ t: '經', s: '经', py: 'jīng' },
					{ t: '綠', s: '绿', py: 'lǜ' }
				],
				structure: [
					{ t: '國', s: '国', py: 'guó' },
					{ t: '學', s: '学', py: 'xué' },
					{ t: '書', s: '书', py: 'shū' },
					{ t: '畫', s: '画', py: 'huà' },
					{ t: '樂', s: '乐', py: 'lè' },
					{ t: '盡', s: '尽', py: 'jǐn' },
					{ t: '奮', s: '奋', py: 'fèn' },
					{ t: '誇', s: '夸', py: 'kuā' },
					{ t: '夾', s: '夹', py: 'jiā' },
					{ t: '舊', s: '旧', py: 'jiù' },
					{ t: '顯', s: '显', py: 'xiǎn' },
					{ t: '塵', s: '尘', py: 'chén' },
					{ t: '從', s: '从', py: 'cóng' },
					{ t: '眾', s: '众', py: 'zhòng' },
					{ t: '體', s: '体', py: 'tǐ' },
					{ t: '辦', s: '办', py: 'bàn' },
					{ t: '邊', s: '边', py: 'biān' },
					{ t: '運', s: '运', py: 'yùn' },
					{ t: '動', s: '动', py: 'dòng' },
					{ t: '實', s: '实', py: 'shí' },
					{ t: '寶', s: '宝', py: 'bǎo' },
					{ t: '廣', s: '广', py: 'guǎng' },
					{ t: '廠', s: '厂', py: 'chǎng' },
					{ t: '萬', s: '万', py: 'wàn' },
					{ t: '與', s: '与', py: 'yǔ' },
					{ t: '專', s: '专', py: 'zhuān' },
					{ t: '世', s: '世', py: 'shì' },
					{ t: '業', s: '业', py: 'yè' },
					{ t: '東', s: '东', py: 'dōng' },
					{ t: '農', s: '农', py: 'nóng' },
					{ t: '電', s: '电', py: 'diàn' },
					{ t: '復', s: '复', py: 'fù' },
					{ t: '夠', s: '够', py: 'gòu' },
					{ t: '圖', s: '图', py: 'tú' },
					{ t: '圍', s: '围', py: 'wéi' },
					{ t: '執', s: '执', py: 'zhí' },
					{ t: '處', s: '处', py: 'chù' },
					{ t: '備', s: '备', py: 'bèi' },
					{ t: '變', s: '变', py: 'biàn' },
					{ t: '選', s: '选', py: 'xuǎn' },
					{ t: '隨', s: '随', py: 'suí' }
				],
				replace: [
					{ t: '後', s: '后', py: 'hòu' },
					{ t: '裡', s: '里', py: 'lǐ' },
					{ t: '鬆', s: '松', py: 'sōng' },
					{ t: '鬥', s: '斗', py: 'dǒu' },
					{ t: '麵', s: '面', py: 'miàn' },
					{ t: '穀', s: '谷', py: 'gǔ' },
					{ t: '髮', s: '发', py: 'fà' },
					{ t: '颱', s: '台', py: 'tái' },
					{ t: '幹', s: '干', py: 'gàn' },
					{ t: '瞭', s: '了', py: 'liǎo' },
					{ t: '徵', s: '征', py: 'zhēng' },
					{ t: '範', s: '范', py: 'fàn' },
					{ t: '黨', s: '党', py: 'dǎng' },
					{ t: '鹹', s: '咸', py: 'xián' },
					{ t: '薑', s: '姜', py: 'jiāng' },
					{ t: '鬱', s: '郁', py: 'yù' },
					{ t: '築', s: '筑', py: 'zhù' },
					{ t: '醜', s: '丑', py: 'chǒu' },
					{ t: '纔', s: '才', py: 'cái' },
					{ t: '齒', s: '齿', py: 'chǐ' },
					{ t: '迴', s: '回', py: 'huí' },
					{ t: '煇', s: '辉', py: 'huī' },
					{ t: '姦', s: '奸', py: 'jiān' },
					{ t: '淚', s: '泪', py: 'lèi' },
					{ t: '貓', s: '猫', py: 'māo' },
					{ t: '憑', s: '凭', py: 'píng' },
					{ t: '籤', s: '签', py: 'qiān' },
					{ t: '犧', s: '牺', py: 'xī' },
					{ t: '蹟', s: '迹', py: 'jì' },
					{ t: '薦', s: '荐', py: 'jiàn' },
					{ t: '覆', s: '复', py: 'fù' },
					{ t: '簾', s: '帘', py: 'lián' },
					{ t: '緻', s: '致', py: 'zhì' }
				]
			}
		};
	},

	computed: {
		inputStats() {
			return this.calcStats(this.inputText);
		},
		outputStats() {
			return this.calcStats(this.outputText);
		},
		filteredPairs() {
			const pairs = this.comparisonData[this.activeCategory] || [];
			if (!this.searchQuery.trim()) return pairs;
			const q = this.searchQuery.trim();
			return pairs.filter(function(p) {
				return p.t.indexOf(q) !== -1 || p.s.indexOf(q) !== -1 || p.py.indexOf(q) !== -1;
			});
		},
		filteredDict() {
			if (this.dictFilter === 'all') return this.customDict;
			return this.customDict.filter(function(e) {
				return e.category === this.dictFilter;
			}.bind(this));
		},
		categoryPickerIndex() {
			var idx = this.categoryOptions.findIndex(function(c) {
				return c.value === this.newEntry.category;
			}.bind(this));
			return idx >= 0 ? idx : 0;
		}
	},

	watch: {
		customDict: {
			deep: true,
			handler: function(val) {
				uni.setStorageSync('customDict', val);
			}
		},
		history: {
			deep: true,
			handler: function(val) {
				uni.setStorageSync('convertHistory', val);
			}
		}
	},

	methods: {
		calcStats: function(text) {
			if (!text) return { total: 0, chinese: 0, english: 0, punctuation: 0, paragraphs: 0 };
			var chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
			var englishWords = text.match(/[a-zA-Z]+/g);
			var english = englishWords ? englishWords.length : 0;
			var punctuation = (text.match(/[\u3002\uff0c\uff01\uff1f\uff1b\uff1a\u201c\u201d\u2018\u2019\u3001\u300a\u300b\u2014\u2026\uff08\uff09\u3010\u3011.,!?;:\'"()-\[\]{}\/\\@#$%^&*+=<>~`|]/g) || []).length;
			var paragraphs = text.split(/\n/).filter(function(p) { return p.trim().length > 0; }).length;
			return { total: text.length, chinese: chinese, english: english, punctuation: punctuation, paragraphs: paragraphs };
		},

		doConvert: function() {
			if (!this.inputText.trim()) {
				uni.showToast({ title: '请输入文本', icon: 'none' });
				return;
			}
			var converterMap = [
				{ from: 'cn', to: 'twp' },
				{ from: 'cn', to: 'hkp' },
				{ from: 'cn', to: 't' },
				{ from: 'twp', to: 'cn' },
				{ from: 'hkp', to: 'cn' },
				{ from: 't', to: 'cn' }
			];
			var config = converterMap[this.directionIndex];
			var result;
			try {
				var converter = opencc.Converter({ from: config.from, to: config.to });
				result = converter(this.inputText);
			} catch (e) {
				result = this.inputText;
			}
			if (this.useCustomDict && this.customDict.length > 0) {
				var isS2T = this.directionIndex < 3;
				for (var i = 0; i < this.customDict.length; i++) {
					var entry = this.customDict[i];
					if (isS2T) {
						result = result.split(entry.simplified).join(entry.traditional);
					} else {
						result = result.split(entry.traditional).join(entry.simplified);
					}
				}
			}
			this.outputText = result;
			this.saveHistory();
		},

		doCopy: function() {
			this.copyText(this.outputText);
		},

		copyText: function(text) {
			if (!text) return;
			uni.setClipboardData({
				data: text,
				success: function() {
					uni.showToast({ title: '已复制', icon: 'success' });
				}
			});
		},

		doClear: function() {
			this.inputText = '';
			this.outputText = '';
		},

		doSwap: function() {
			this.inputText = this.outputText;
			this.outputText = '';
		},

		doSample: function() {
			this.inputText = '中华人民共和国是一个历史悠久、文化灿烂的国家。随着科技的不断进步，人工智能、云计算、大数据等新技术正在深刻改变着人们的生活方式。在教育领域，在线学习平台为偏远地区的学生提供了优质的学习资源；在医疗领域，远程诊断技术让患者足不出户就能获得专家的建议。我们相信，在不久的将来，数字化、网络化、智能化将成为社会发展的主流趋势。';
		},

		saveHistory: function() {
			var dirLabels = [
				'简体→繁体(台湾)',
				'简体→繁体(香港)',
				'简体→繁体(通用)',
				'繁体(台湾)→简体',
				'繁体(香港)→简体',
				'繁体(通用)→简体'
			];
			var entry = {
				time: this.formatTime(new Date()),
				direction: dirLabels[this.directionIndex],
				inputPreview: this.inputText.substring(0, 30),
				outputPreview: this.outputText.substring(0, 30),
				inputFull: this.inputText,
				outputFull: this.outputText
			};
			this.history.unshift(entry);
			if (this.history.length > 20) {
				this.history = this.history.slice(0, 20);
			}
		},

		formatTime: formatDateTime,

		toggleHistory: function(idx) {
			this.expandedHistory = this.expandedHistory === idx ? -1 : idx;
		},

		clearHistory: function() {
			var self = this;
			uni.showModal({
				title: '提示',
				content: '确定清空全部转换历史？',
				success: function(res) {
					if (res.confirm) {
						self.history = [];
						uni.setStorageSync('convertHistory', []);
					}
				}
			});
		},

		onCategoryPick: function(e) {
			this.newEntry.category = this.categoryOptions[e.detail.value].value;
		},

		addEntry: function() {
			if (!this.newEntry.simplified.trim() || !this.newEntry.traditional.trim() || !this.newEntry.category) {
				uni.showToast({ title: '请填写完整信息', icon: 'none' });
				return;
			}
			this.customDict.push({
				simplified: this.newEntry.simplified.trim(),
				traditional: this.newEntry.traditional.trim(),
				category: this.newEntry.category
			});
			this.newEntry = { simplified: '', traditional: '', category: '' };
			uni.showToast({ title: '添加成功', icon: 'success' });
		},

		removeEntry: function(globalIdx) {
			var item = this.filteredDict[globalIdx];
			var realIdx = this.customDict.findIndex(function(e) {
				return e.simplified === item.simplified && e.traditional === item.traditional && e.category === item.category;
			});
			if (realIdx !== -1) {
				this.customDict.splice(realIdx, 1);
			}
		},

		countByCategory: function(cat) {
			return this.customDict.filter(function(e) { return e.category === cat; }).length;
		},

		getCategoryLabel: function(value) {
			var found = this.categoryOptions.find(function(c) { return c.value === value; });
			return found ? found.label : value;
		},

		importPreset: function(key) {
			var preset = this.presetDicts[key];
			if (!preset) return;
			var self = this;
			uni.showModal({
				title: '导入词库',
				content: '确定导入「' + preset.name + '」（' + preset.data.length + '条）？',
				success: function(res) {
					if (res.confirm) {
						preset.data.forEach(function(entry) {
							var exists = self.customDict.some(function(e) {
								return e.simplified === entry.simplified && e.category === entry.category;
							});
							if (!exists) {
								self.customDict.push(Object.assign({}, entry));
							}
						});
						uni.showToast({ title: '导入成功', icon: 'success' });
					}
				}
			});
		}
	},

	onLoad: function() {
		try {
			var dict = uni.getStorageSync('customDict');
			if (dict) this.customDict = dict;
		} catch (e) {}
		try {
			var hist = uni.getStorageSync('convertHistory');
			if (hist) this.history = hist;
		} catch (e) {}
	}
};
</script>

<style lang="scss" scoped>
$primary: #19be6b;
$primary-light: #e8f8ee;
$primary-dark: #15a35d;
$danger: #fa5151;
$danger-light: #fef0f0;
$bg: #f5f6fa;
$card-bg: #ffffff;
$text-primary: #333333;
$text-secondary: #666666;
$text-muted: #999999;
$border: #e8e8e8;
$radius: 16rpx;

page {
	background-color: $bg;
}

.page {
	padding-bottom: 60rpx;
}

/* ========== Tab Bar ========== */
.tab-bar {
	position: sticky;
	top: 0;
	z-index: 100;
	display: flex;
	background: $card-bg;
	padding: 0 12rpx;
	border-bottom: 1rpx solid $border;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 24rpx 0;
	font-size: 26rpx;
	color: $text-secondary;
	position: relative;
	transition: color 0.25s;

	&.active {
		color: $primary;
		font-weight: 600;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 48rpx;
			height: 4rpx;
			background: $primary;
			border-radius: 2rpx;
		}
	}
}

/* ========== Tab Content ========== */
.tab-content {
	padding: 20rpx 24rpx 0;
}

/* ========== Card ========== */
.card {
	background: $card-bg;
	border-radius: $radius;
	padding: 28rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

/* ========== Section ========== */
.section-label {
	font-size: 28rpx;
	color: $text-primary;
	font-weight: 500;
	margin-bottom: 16rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: $text-primary;
}

.section-desc {
	font-size: 24rpx;
	color: $text-muted;
	margin-top: 6rpx;
	margin-bottom: 20rpx;
}

.word-count {
	font-size: 24rpx;
	color: $text-muted;
}

/* ========== Segmented Control ========== */
.seg-control {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.seg-item {
	padding: 12rpx 20rpx;
	border-radius: 8rpx;
	background: #f5f5f5;
	text-align: center;
	transition: all 0.25s;

	&.active {
		background: $primary;
	}

	.seg-text {
		font-size: 24rpx;
		color: $text-secondary;
		white-space: nowrap;
	}

	&.active .seg-text {
		color: #ffffff;
		font-weight: 500;
	}
}

/* ========== Textarea ========== */
.text-area {
	width: 100%;
	min-height: 360rpx;
	padding: 20rpx;
	border: 1rpx solid $border;
	border-radius: 12rpx;
	font-size: 30rpx;
	line-height: 1.6;
	color: $text-primary;
	background: #fafafa;
	box-sizing: border-box;
}

/* ========== Stats ========== */
.stats-row {
	display: flex;
	gap: 20rpx;
	margin-top: 14rpx;
	flex-wrap: wrap;

	text {
		font-size: 22rpx;
		color: $text-muted;
		background: #f5f5f5;
		padding: 4rpx 14rpx;
		border-radius: 6rpx;
	}
}

/* ========== Output ========== */
.output-area {
	min-height: 200rpx;
	padding: 20rpx;
	background: $primary-light;
	border-radius: 12rpx;
	border: 1rpx solid rgba(25, 190, 107, 0.2);
}

.empty-output {
	background: #f9f9f9;
	border-color: $border;
	display: flex;
	align-items: center;
	justify-content: center;
}

.output-text {
	font-size: 30rpx;
	line-height: 1.8;
	color: $text-primary;
	word-break: break-all;
}

.placeholder-text {
	font-size: 28rpx;
	color: $text-muted;
}

/* ========== Action Buttons ========== */
.action-row {
	display: flex;
	gap: 16rpx;
	margin-top: 20rpx;

	&.inner {
		margin-top: 16rpx;
	}
}

.act-btn {
	flex: 1;
	padding: 18rpx 0;
	border-radius: 12rpx;
	text-align: center;
	background: #f0f0f0;
	transition: background 0.2s;

	&.primary {
		background: $primary;
	}

	&.danger {
		background: $danger-light;
	}

	&:active {
		opacity: 0.8;
	}
}

.act-btn-text {
	font-size: 28rpx;
	color: $text-primary;

	.primary & {
		color: #ffffff;
		font-weight: 500;
	}

	.danger & {
		color: $danger;
	}
}

/* ========== Toggle ========== */
.toggle-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.toggle-label {
	font-size: 28rpx;
	color: $text-primary;
	font-weight: 500;
}

.toggle-group {
	display: flex;
	background: #f0f0f0;
	border-radius: 12rpx;
	overflow: hidden;
}

.toggle-btn {
	padding: 12rpx 32rpx;
	font-size: 26rpx;
	color: $text-secondary;
	transition: all 0.25s;

	&.active {
		background: $primary;
		color: #ffffff;
		font-weight: 500;
	}
}

/* ========== Search ========== */
.search-bar {
	margin-top: 20rpx;
}

.search-input {
	width: 100%;
	padding: 18rpx 24rpx;
	border: 1rpx solid $border;
	border-radius: 12rpx;
	font-size: 28rpx;
	background: #fafafa;
	box-sizing: border-box;
}

/* ========== Category Tags ========== */
.cat-scroll {
	white-space: nowrap;
}

.cat-list {
	display: flex;
	gap: 16rpx;
	padding: 4rpx 0;
}

.cat-tag {
	display: inline-flex;
	padding: 12rpx 28rpx;
	border-radius: 32rpx;
	background: #f5f5f5;
	font-size: 26rpx;
	color: $text-secondary;
	transition: all 0.25s;
	white-space: nowrap;

	&.active {
		background: $primary;
		color: #ffffff;
		font-weight: 500;
	}
}

/* ========== Compare Grid ========== */
.compare-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16rpx;
	padding-bottom: 20rpx;
}

.compare-card {
	background: $card-bg;
	border-radius: $radius;
	padding: 24rpx 16rpx;
	text-align: center;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

.pair-row {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
}

.pair-char {
	font-size: 52rpx;
	font-weight: bold;
	line-height: 1.2;

	&.primary-char {
		color: $primary;
	}

	&.secondary-char {
		color: $text-primary;
	}
}

.pair-arrow {
	font-size: 28rpx;
	color: $text-muted;
}

.pair-pinyin {
	font-size: 24rpx;
	color: $text-muted;
	margin-top: 10rpx;
	display: block;
}

/* ========== Form ========== */
.form-group {
	margin-bottom: 16rpx;
}

.form-input {
	width: 100%;
	padding: 18rpx 24rpx;
	border: 1rpx solid $border;
	border-radius: 12rpx;
	font-size: 28rpx;
	background: #fafafa;
	box-sizing: border-box;
}

.form-picker {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 18rpx 24rpx;
	border: 1rpx solid $border;
	border-radius: 12rpx;
	background: #fafafa;
	font-size: 28rpx;
	color: $text-primary;
}

.picker-placeholder {
	color: $text-muted;
}

.picker-arrow {
	color: $text-muted;
	font-size: 22rpx;
}

/* ========== Dictionary List ========== */
.dict-list {
	margin-top: 20rpx;
	max-height: 600rpx;
	overflow-y: auto;
}

.dict-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;

	&:last-child {
		border-bottom: none;
	}
}

.dict-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex: 1;
	flex-wrap: wrap;
}

.dict-word {
	font-size: 30rpx;
	color: $text-primary;
	font-weight: 500;
}

.dict-arrow {
	font-size: 24rpx;
	color: $primary;
}

.dict-cat-tag {
	font-size: 20rpx;
	color: $primary;
	background: $primary-light;
	padding: 4rpx 12rpx;
	border-radius: 6rpx;
	margin-left: 8rpx;
}

.dict-del {
	padding: 8rpx 20rpx;
	background: $danger-light;
	border-radius: 8rpx;
	flex-shrink: 0;
	margin-left: 16rpx;
}

.del-text {
	font-size: 24rpx;
	color: $danger;
}

/* ========== Preset ========== */
.preset-list {
	margin-top: 10rpx;
}

.preset-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;

	&:last-child {
		border-bottom: none;
	}
}

.preset-info {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.preset-name {
	font-size: 28rpx;
	color: $text-primary;
	font-weight: 500;
}

.preset-count {
	font-size: 22rpx;
	color: $text-muted;
}

.preset-btn {
	padding: 12rpx 28rpx;
	background: $primary;
	border-radius: 8rpx;
}

.preset-btn-text {
	font-size: 26rpx;
	color: #ffffff;
	font-weight: 500;
}

/* ========== History ========== */
.history-card {
	&:active {
		background: #fafafa;
	}
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 14rpx;
}

.history-time {
	font-size: 24rpx;
	color: $text-muted;
}

.history-dir-tag {
	font-size: 22rpx;
	color: $primary;
	background: $primary-light;
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
}

.history-preview {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.preview-line {
	display: flex;
	align-items: flex-start;
}

.preview-label {
	font-size: 24rpx;
	color: $text-muted;
	flex-shrink: 0;
	width: 80rpx;
}

.preview-value {
	font-size: 26rpx;
	color: $text-secondary;
	flex: 1;
	word-break: break-all;
}

.history-detail {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}

.detail-block {
	margin-bottom: 20rpx;
}

.detail-label {
	font-size: 24rpx;
	color: $text-muted;
	margin-bottom: 8rpx;
	display: block;
}

.detail-text {
	font-size: 28rpx;
	color: $text-primary;
	line-height: 1.6;
	word-break: break-all;
	display: block;
}

/* ========== Empty State ========== */
.empty-state {
	text-align: center;
	padding: 60rpx 0;
	color: $text-muted;
	font-size: 28rpx;
}

/* ========== Clear Text ========== */
.clear-text {
	font-size: 26rpx;
	color: $danger;
}

/* ========== Utility ========== */
.info-row {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20rpx;
}

.info-arrow {
	font-size: 32rpx;
	color: $text-muted;
}
</style>
